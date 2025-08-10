/** @format */

import { NotificationItem } from "@/types/dashboard";
import React from "react";

type Props = {
  data: NotificationItem[];
};

const NotificationCard = (props: Props) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      {props.data.length > 0 ? (
        <ul className="space-y-2">
          {props.data.map((notification, index) => (
            <li key={index} className="border-b pb-2">
              <p className="text-sm">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationCard;
