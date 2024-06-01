'use client'
// <reference types="qrcode" />
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export function Component() {
  const [link, setLink] = useState("");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [format, setFormat] = useState("image");
  const [isValidLink, setIsValidLink] = useState(true); // Estado para validar el enlace
  const [qrSize, setQrSize] = useState(200); // Tamaño predeterminado del código QR

  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
    return urlPattern.test(url);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLink(value);
    setIsValidLink(isValidUrl(value));
  };

  const handleGenerateQRCode = async () => {
    if (!isValidLink) {
      console.error("Invalid URL");
      return;
    }

    try {
      const data = await QRCode.toDataURL(link, { width: qrSize }); 
      setQrCodeData(data);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  const handleDownload = () => {
    if (!qrCodeData) return;

    const link = document.createElement("a");
    if (format === "image") {
      link.download = "qrcode.png";
      link.href = qrCodeData;
      link.click();
    } else {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(qrCodeData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(qrCodeData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("qrcode.pdf");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">QR Code Generator</h1>
      <div className="grid gap-4">
        <div className="text-white">
          <Label className="text-black" htmlFor="link">Link</Label>
          <Input 
            id="link"
            placeholder="Enter a link"
            type="text"
            value={link}
            onChange={handleLinkChange} 
          />
          {!isValidLink && <p className="text-red-500">Invalid URL</p>} {/* Mostrar mensaje de error si la URL es inválida */}
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="size">Size</Label>
          <div className="flex items-center space-x-4 text-white">
            <Input
              id="size"
              type="number"
              min="100"
              max="500"
              value={qrSize}
              onChange={(e) => setQrSize(parseInt(e.target.value))}
              className="w-full text-center bg-white text-white"
            />
            <span className="text-gray-900 dark:text-gray-100">px</span>
          </div>
        </div>
        <div>
          <Label>Format</Label>
          <div className="flex items-center gap-4">
            <label htmlFor="image">
              <input
                type="radio"
                id="image"
                name="format"
                value="image"
                checked={format === "image"}
                onChange={handleFormatChange}
              />
              Image
            </label>
            <label htmlFor="pdf">
              <input
                type="radio"
                id="pdf"
                name="format"
                value="pdf"
                checked={format === "pdf"}
                onChange={handleFormatChange}
              />
              PDF
            </label>
          </div>
        </div>
        <Button onClick={handleGenerateQRCode} className="w-full">
          Generate QR Code
        </Button>
        {qrCodeData && (
          <div className="flex flex-col items-center gap-4">
            <img src={qrCodeData} alt="QR Code" />
            <div className="flex gap-4">
              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-500 hover:to-green-500 transition-colors duration-300"
              >
                Download {format === "image" ? "Image" : "PDF"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
