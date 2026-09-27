import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';

const StoryExport = forwardRef((props, ref) => {
  const exportAreaRef = useRef(null);
  const storyTextRef = useRef(null);
  const headerBgRef = useRef(null);

  useImperativeHandle(ref, () => ({
    generateStory: async (content, platform, buttonElement) => {
      const originalContent = buttonElement.innerHTML;
      
      buttonElement.innerHTML = '⏳';
      buttonElement.disabled = true;
      buttonElement.classList.add('opacity-50', 'cursor-not-allowed');

      if (storyTextRef.current) {
        storyTextRef.current.innerText = content;
      }

      const exportArea = exportAreaRef.current;
      const headerBg = headerBgRef.current;

      if (platform === 'WA') {
        exportArea.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        headerBg.style.background = 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)';
      } else {
        exportArea.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
        headerBg.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)';
      }

      exportArea.style.opacity = '1';

      try {
        const canvas = await html2canvas(exportArea, {
          scale: 1,
          useCORS: true,
          backgroundColor: null,
          logging: false
        });

        exportArea.style.opacity = '0';

        canvas.toBlob((blob) => {
          const fileName = `HeyDay-${platform}-${new Date().getTime()}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'HeyDay Secret Message',
              text: 'Kirim pesan anonim ke saya di heyday-secret.vercel.app!'
            }).then(() => {
              resetButton(buttonElement, originalContent);
            }).catch(err => {
              if (err.name !== 'AbortError') {
                handleDesktopShare(platform, canvas, fileName);
              }
              resetButton(buttonElement, originalContent);
            });
          } else {
            handleDesktopShare(platform, canvas, fileName);
            resetButton(buttonElement, originalContent);
          }
        }, 'image/png');

      } catch (err) {
        alert('Failed to process the image. Error: ' + err);
        exportArea.style.opacity = '0';
        resetButton(buttonElement, originalContent);
      }
    }
  }));

  const handleDesktopShare = (platform, canvas, fileName) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (platform === 'WA') {
      const shareText = encodeURIComponent("Kirim pesan anonim ke saya lewat sini ya! 👇\nhttps://heyday-secret.vercel.app");
      window.open(`https://wa.me/?text=${shareText}`, '_blank');
    }
  };

  const resetButton = (button, originalContent) => {
    button.innerHTML = originalContent;
    button.disabled = false;
    button.classList.remove('opacity-50', 'cursor-not-allowed');
  };

  return (
    <div 
      ref={exportAreaRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '1080px', height: '1920px', zIndex: -9999, opacity: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '880px', borderRadius: '45px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '4px solid rgba(255, 255, 255, 0.4)' }}>
        
        <div ref={headerBgRef} style={{ padding: '60px 50px', textAlign: 'center' }}>
          <h2 style={{ color: '#ffffff', fontSize: '45px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            send me anonymous messages!
          </h2>
        </div>

        <div style={{ padding: '90px 70px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '600px' }}>
          <p ref={storyTextRef} style={{ fontSize: '58px', lineHeight: 1.5, color: '#1f2937', fontWeight: 700, wordWrap: 'break-word', whiteSpace: 'pre-wrap', margin: 0 }}>
            The message content will appear here...
          </p>
        </div>

        <div style={{ background: '#f9fafb', padding: '45px 50px', textAlign: 'center', borderTop: '2px solid #f3f4f6' }}>
          <p style={{ fontSize: '30px', color: '#9ca3af', fontWeight: 600, margin: 0 }}>
            heyday-secret.vercel.app
          </p>
        </div>
      </div>
    </div>
  );
});

export default StoryExport;