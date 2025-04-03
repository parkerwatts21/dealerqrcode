// global.d.ts
declare module 'qrcode.react' {
    import * as React from 'react';
    export interface QRCodeProps extends React.SVGProps<SVGSVGElement> {
      value: string;
      size?: number;
      level?: "L" | "M" | "Q" | "H";
    }
    const QRCode: React.FC<QRCodeProps>;
    export default QRCode;
    export { QRCode };
  }