import React, { useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


interface FileInputProps {
    onTextLoaded: (text: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onTextLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Função para extrair texto do PDF
    async function extractTextFromPDF(file: File) {
        // Lê o arquivo como ArrayBuffer
        const buffer = await file.arrayBuffer();
        // Carrega o PDF
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            // Junta os textos de cada item da página
            const pageText = content.items.map((item: any) => item.str).join(" ");
            text += pageText + "\n";
        }
        return text;
    }

    // Handler para arquivos de texto ou PDF
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
            // Se for PDF
            const text = await extractTextFromPDF(file);
            onTextLoaded(text);
        } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
            // Se for TXT
            const text = await file.text();
            onTextLoaded(text);
        } else {
            alert("Só aceitamos arquivos .txt ou .pdf por enquanto.");
            return;
        }
        e.target.value = ""; // Limpa o input para permitir novo upload igual
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTextLoaded(e.target.value);
    };

    return (
        <div className="file-input">
            <label className="file-label" htmlFor="file-upload">
                <strong>Escolha um arquivo (.txt ou .pdf)</strong>
                <button
                    className="file-btn"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Selecionar arquivo
                </button>
                <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,application/pdf"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </label>
            <br />
            <textarea
                rows={6}
                placeholder="Se preferir, cole seu texto aqui..."
                className="file-input-textarea"
                onChange={handleTextareaChange}
            />
        </div>
    );
};

export default FileInput;
