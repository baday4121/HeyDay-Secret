<div id="story-export-area" style="position: fixed; top: 0; left: 0; width: 1080px; height: 1920px; z-index: -9999; opacity: 0; pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%); padding: 80px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    
    <div style="background: #ffffff; width: 100%; max-width: 880px; border-radius: 45px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; border: 4px solid rgba(255, 255, 255, 0.4);">
        
        <div id="story-header-bg" style="background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%); padding: 60px 50px; text-align: center;">
            <h2 style="color: #ffffff; font-size: 45px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                send me anonymous messages!
            </h2>
        </div>

        <div style="padding: 90px 70px; text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 600px;">
            <p id="story-text" style="font-size: 58px; line-height: 1.5; color: #1f2937; font-weight: 700; word-wrap: break-word; white-space: pre-wrap; margin: 0;">
                The message content will appear here...
            </p>
        </div>

        <div style="background: #f9fafb; padding: 45px 50px; text-align: center; border-top: 2px solid #f3f4f6;">
            <p style="font-size: 30px; color: #9ca3af; font-weight: 600; margin: 0;">
                heyday-secret.vercel.app
            </p>
        </div>
    </div>
</div>

@push('scripts')
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<script>
    function generateStory(buttonElement, platform) {
        const messageContent = buttonElement.getAttribute('data-message');
        const originalContent = buttonElement.innerHTML;
        
        buttonElement.innerHTML = '⏳';
        buttonElement.disabled = true;
        buttonElement.classList.add('opacity-50', 'cursor-not-allowed');

        document.getElementById('story-text').innerText = messageContent;
        const exportArea = document.getElementById('story-export-area');
        const headerBg = document.getElementById('story-header-bg');
        
        if (platform === 'WA') {
            exportArea.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
            headerBg.style.background = 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)';
        } else {
            exportArea.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
            headerBg.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)';
        }

        exportArea.style.opacity = '1';

        html2canvas(exportArea, {
            scale: 1, 
            useCORS: true,
            backgroundColor: null,
            logging: false
        }).then(canvas => {
            exportArea.style.opacity = '0';
            
            canvas.toBlob(function(blob) {
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

        }).catch(err => {
            alert('Failed to process the image. Error: ' + err);
            exportArea.style.opacity = '0';
            resetButton(buttonElement, originalContent);
        });
    }

    function handleDesktopShare(platform, canvas, fileName) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (platform === 'WA') {
            const shareText = encodeURIComponent("Kirim pesan anonim ke saya lewat sini ya! 👇\nhttps://heyday-secret.vercel.app");
            window.open(`https://wa.me/?text=${shareText}`, '_blank');
        }
    }

    function resetButton(button, originalContent) {
        button.innerHTML = originalContent;
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
</script>
@endpush