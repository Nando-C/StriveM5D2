import PdfPrinter from 'pdfmake'
import striptags from 'striptags'

export const generatePDFReadableStream = data => {
    const fonts = {
        Roboto: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-Oblique",
        }
    }

    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: [
            {
                text: `${data.title}`,
                style: 'header'
            },
            {
                text: `by ${data.author.name}`,
                style: 'subheader'
            },
            { 
               text: striptags(`${data.content}`, [], '\n'),
               alignment: 'center' 
            }
            
        ],
        styles: {
            header: {
                fontSize: 16,
                bold: true,
            },
            subheader: {
                fontSize: 12,
			    bold: true,
            }
        }
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()
    return pdfReadableStream
}
