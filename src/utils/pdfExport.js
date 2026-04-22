export const exportResumePaperToPdf = async ({ paper, html2canvas, jsPDF, filename }) => {
  if (!paper) throw new Error('paper not found')

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const waitForImages = async (root) => {
    const images = Array.from(root.querySelectorAll('img'))
    await Promise.all(images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve()
      return new Promise((resolve) => {
        image.onload = resolve
        image.onerror = resolve
      })
    }))
  }

  const wrapper = document.createElement('div')
  const clone = paper.cloneNode(true)
  clone.classList.add('pdf-export-mode')
  const paperWidth = paper.offsetWidth || 794
  const pageRatio = 297 / 210
  const singlePageHeight = Math.round(paperWidth * pageRatio)
  const paperHeight = Math.max(paper.scrollHeight, paper.offsetHeight, singlePageHeight)

  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${paperWidth}px`,
    minHeight: `${paperHeight}px`,
    overflow: 'visible',
    background: '#ffffff',
    pointerEvents: 'none',
    zIndex: '-1'
  })

  Object.assign(clone.style, {
    width: `${paperWidth}px`,
    minHeight: `${paperHeight}px`,
    margin: '0',
    transform: 'none',
    boxShadow: 'none'
  })

  const exportStyle = document.createElement('style')
  exportStyle.textContent = `
    .pdf-export-mode .avatar {
      width: 78px !important;
      height: 78px !important;
      min-width: 78px !important;
      max-width: 78px !important;
      flex: 0 0 78px !important;
      aspect-ratio: 1 / 1 !important;
      position: relative !important;
      display: block !important;
      overflow: hidden !important;
      border-radius: 999px !important;
      clip-path: none !important;
    }

    .pdf-export-mode .avatar img {
      position: absolute !important;
      inset: 0 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      min-width: 100% !important;
      min-height: 100% !important;
      object-fit: cover !important;
      object-position: center center !important;
      border-radius: inherit !important;
    }

    .pdf-export-mode .contacts,
    .pdf-export-mode .contact-item,
    .pdf-export-mode .contact-item b {
      overflow: visible !important;
    }

    .pdf-export-mode .contact-item b {
      white-space: normal !important;
      text-overflow: clip !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      line-height: 1.32 !important;
    }
  `

  clone.querySelectorAll('.avatar').forEach((node) => {
    Object.assign(node.style, {
      width: '78px',
      height: '78px',
      minWidth: '78px',
      maxWidth: '78px',
      flex: '0 0 78px',
      aspectRatio: '1 / 1',
      position: 'relative',
      display: 'block',
      borderRadius: '999px',
      overflow: 'hidden',
      clipPath: 'none'
    })
  })

  clone.querySelectorAll('.avatar img').forEach((node) => {
    Object.assign(node.style, {
      position: 'absolute',
      inset: '0',
      display: 'block',
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      maxHeight: 'none',
      minWidth: '100%',
      minHeight: '100%',
      objectFit: 'cover',
      objectPosition: 'center center',
      borderRadius: 'inherit'
    })
  })

  wrapper.appendChild(exportStyle)
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  await waitForImages(clone)
  await new Promise(resolve => requestAnimationFrame(resolve))
  await new Promise(resolve => requestAnimationFrame(resolve))

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: paperWidth,
      height: paperHeight,
      windowWidth: paperWidth,
      windowHeight: paperHeight,
      scrollX: 0,
      scrollY: 0
    })

    const imageData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const rawImageHeight = (canvas.height * pageWidth) / canvas.width
    const imageHeight = rawImageHeight <= pageHeight + 1 ? pageHeight : rawImageHeight
    let heightLeft = imageHeight
    let position = 0

    pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
    heightLeft -= pageHeight

    while (heightLeft > 1) {
      position = heightLeft - imageHeight
      pdf.addPage()
      pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } finally {
    wrapper.remove()
  }
}
