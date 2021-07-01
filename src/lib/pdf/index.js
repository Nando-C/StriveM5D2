import PdfPrinter from 'pdfmake'
import striptags from 'striptags'
import axios from 'axios'

export const generatePDFReadableStream = async (post) => {
    const fonts = {
        Roboto: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-Oblique",
        }
    }

    let coverImg = {}
    if(post.cover) {
        const response = await axios.get(post.cover, {
            responseType: "arraybuffer"
        })
        const blogCoverURLParts = post.cover.split("/")
        const fileName = blogCoverURLParts[blogCoverURLParts.length -1]
        const [id, extension] = fileName.split(".")
        const base64 = response.data.toString("base64")
        const base64Img = `data:image/${extension};base64,${base64}`
        coverImg = { image: base64Img, width: 500, margin: [0, 0, 0, 30] }
    }
    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: [
            
            coverImg,
            
            {
                text: `${post.title}`,
                style: 'header'
            },
            {
                text: `by ${post.author.name}`,
                style: 'subheader'
            },
            { 
               text: striptags(`${post.content}`, [], '\n'),
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
