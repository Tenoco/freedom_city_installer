document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const installButton = document.getElementById('install-button');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    // File data - reordering to have resources.zip first
    const files = [
        { name: 'freedom_city_resources.zip', size: 6.47, url: 'freedom_city_resources.zip' }, // Resources first
        { name: 'freedom_city_v1.apk', size: 31, url: 'freedom_city_v1.apk' } // APK second
    ];
    
    // Total size of all files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    
    // Function to open the modal
    function openModal() {
        modal.classList.add('show');
        simulateDownload();
    }
    
    // Function to close the modal
    function closeModal() {
        modal.classList.remove('show');
        // Reset the progress
        progressFill.style.width = '0%';
        progressText.textContent = 'Preparing downloads...';
    }
    
    // Function to simulate the download process
    function simulateDownload() {
        let downloaded = 0;
        let currentFileIndex = 0;
        
        // Update progress every 100ms
        const interval = setInterval(() => {
            // Simulate random download speed between 5-15 MB/s
            const speed = Math.random() * 10 + 5;
            downloaded += speed;
            
            // Calculate the percentage
            const percentage = Math.min((downloaded / totalSize) * 100, 100);
            
            // Update the progress bar
            progressFill.style.width = `${percentage}%`;
            
            // Update the progress text
            if (percentage < 100) {
                const remainingTime = Math.ceil((totalSize - downloaded) / speed);
                progressText.textContent = `Downloading... ${Math.floor(percentage)}% (${remainingTime} seconds remaining)`;
            } else {
                progressText.textContent = 'Download complete! Files are being saved to your device.';
                clearInterval(interval);
                
                // Start actual downloads
                setTimeout(() => {
                    downloadFiles();
                }, 1500);
            }
            
            // Update current file being downloaded
            const currentDownloaded = downloaded;
            let filesSizeSum = 0;
            
            for (let i = 0; i < files.length; i++) {
                filesSizeSum += files[i].size;
                if (currentDownloaded < filesSizeSum) {
                    if (currentFileIndex !== i) {
                        currentFileIndex = i;
                        if (i > 0) {
                            document.querySelector(`.file:nth-child(${i})`).style.opacity = '0.5';
                        }
                    }
                    break;
                }
            }
            
        }, 100);
    }
    
    // Function to trigger the actual downloads - Updated to ensure sequential downloads
    function downloadFiles() {
        // Create a function to download files sequentially
        function downloadSequentially(index) {
            if (index >= files.length) {
                // All files have been downloaded
                setTimeout(closeModal, 1000);
                return;
            }
            
            const file = files[index];
            progressText.textContent = `Installing ${file.name}...`;
            
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            
            // Create a click event
            const clickEvent = new MouseEvent('click');
            
            // Add an event listener to detect when the download is complete
            link.addEventListener('click', () => {
                // Simulate download completion (in a real environment, this would need a different approach)
                setTimeout(() => {
                    document.body.removeChild(link);
                    // Move to the next file
                    downloadSequentially(index + 1);
                }, file.size * 100); // Simulate download time based on file size
            });
            
            // Trigger the download
            link.dispatchEvent(clickEvent);
        }
        
        // Start the sequential download with the first file (resources.zip)
        downloadSequentially(0);
    }
    
    // Event listeners
    installButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    
    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add smooth scrolling for installation guide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animations to elements when they come into view
    const animateElements = () => {
        const elements = document.querySelectorAll('.detail-widget, .step');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize element animations
    window.addEventListener('scroll', animateElements);
    window.addEventListener('load', animateElements);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .detail-widget, .step {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .ripple {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});