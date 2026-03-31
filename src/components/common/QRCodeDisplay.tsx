"use client";

import { QRCodeCanvas } from "qrcode.react";

type Props = {
  value: string;
};

export default function QRCodeDisplay({ value }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas
        value={value}
        size={120}
        bgColor="transparent"
        fgColor="#000000"
      />

      <p className="text-xs text-slate-500 break-all text-center">{value}</p>
    </div>
  );
}
