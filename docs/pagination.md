# 📘 Keyset Pagination dengan UUIDv4 + CreatedAt

## 🧩 Tujuan

Dokumentasi ini menjelaskan cara implementasi keyset pagination menggunakan kombinasi `UUIDv4` dan `created_at` untuk sistem modular seperti PWA Koperasi Serba Usaha (KSU), yang menggunakan PostgreSQL dan backend Golang-Fiber.

---

## 🧱 Struktur Tabel (Model GORM)

```go
type Simpanan struct {
    ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
    CreatedAt time.Time `gorm:"index:idx_created_at_id,priority:1"`
    // ... field lain
}
```

> Gunakan ekstensi `uuid-ossp` di PostgreSQL dan pastikan kolom `created_at` otomatis terisi saat insert.

## 📌 Index PostgreSQL

```sql
CREATE INDEX idx_created_at_id ON simpanans(created_at, id);
```

---

## 🔁 Format Cursor

```json
{
  "created_at": "2025-08-01T00:00:00Z",
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

> Encode sebagai base64 saat dikirimkan sebagai query param.

---

## 🔧 Implementasi di Golang (Fiber)

### Helper Encode/Decode Cursor

```go
type Cursor struct {
    CreatedAt time.Time `json:"created_at"`
    ID        uuid.UUID `json:"id"`
}

func EncodeCursor(c Cursor) string {
    b, _ := json.Marshal(c)
    return base64.StdEncoding.EncodeToString(b)
}

func DecodeCursor(str string) (Cursor, error) {
    var c Cursor
    data, err := base64.StdEncoding.DecodeString(str)
    if err != nil {
        return c, err
    }
    err = json.Unmarshal(data, &c)
    return c, err
}
```

### Contoh Handler

```go
func GetSimpanans(c *fiber.Ctx) error {
    var simpanans []Simpanan
    limit := c.QueryInt("limit", 50)
    cursorStr := c.Query("cursor", "")

    var cursor Cursor
    if cursorStr != "" {
        parsed, err := DecodeCursor(cursorStr)
        if err != nil {
            return c.Status(400).JSON(fiber.Map{"error": "Invalid cursor"})
        }
        cursor = parsed
    }

    db := database.DB.Model(&Simpanan{})

    if cursorStr != "" {
        db = db.Where("(created_at, id) > (?, ?)", cursor.CreatedAt, cursor.ID)
    }

    db = db.Order("created_at, id").Limit(limit).Find(&simpanans)

    var nextCursor string
    if len(simpanans) == limit {
        last := simpanans[len(simpanans)-1]
        nextCursor = EncodeCursor(Cursor{
            CreatedAt: last.CreatedAt,
            ID:        last.ID,
        })
    }

    return c.JSON(fiber.Map{
        "data":       simpanans,
        "nextCursor": nextCursor,
    })
}
```

---

## 🌐 Contoh Request

```
GET /simpanans?limit=50&cursor=eyJjcmVhdGVkX2F0IjoiMjAyNS0wOC0wMVQwMDowMDowMFoiLCJpZCI6ImY0N2FjMTBiLTU4Y2MtNDM3Mi1hNTY3LTBlMDJiMmMzZDQ3OSJ
```

---

## 📌 Keunggulan

- Tidak tergantung OFFSET
- Performa konsisten di data besar
- Ideal untuk infinite scroll
- Stabil dan tidak berubah saat data berubah

---

## ⚠️ Catatan

- Gunakan composite index `(created_at, id)`
- `created_at` harus NOT NULL
- UUID v4 bersifat acak, jangan digunakan sebagai satu-satunya penentu urutan

