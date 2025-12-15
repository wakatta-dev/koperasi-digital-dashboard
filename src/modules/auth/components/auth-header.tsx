/** @format */

type AuthHeaderProps = {
  title: string;
  description: string;
};

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
