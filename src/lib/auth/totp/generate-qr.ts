import QRCode from "qrcode";

export async function generateQrDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl, {
    margin: 1,
    width: 240,
    errorCorrectionLevel: "M",
  });
}
