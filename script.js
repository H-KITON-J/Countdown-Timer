document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const stopAlertBtn = document.getElementById('stopAlertBtn');
    const targetDateInput = document.getElementById('targetDate');
    const targetTimeInput = document.getElementById('targetTime');
    const themeToggle = document.getElementById('themeToggle');
    const alertSound = document.getElementById('alertSound');
    const messageElement = document.getElementById('message');
    const messageTitle = document.getElementById('messageTitle');
    const messageContent = document.getElementById('messageContent');
    const timerNotes = document.getElementById('timerNotes');
    
    // Notification messages
    const completionMessages = [
        "Time's up! The moment has arrived!",
        "Countdown complete! Time to celebrate!",
        "The wait is over! Your event is here!",
        "Ding ding ding! Time's up!",
        "Mission accomplished! The countdown has ended!",
        "The future is now! Your countdown is complete!"
    ];
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    targetDateInput.setAttribute('min', today);
    
    // Countdown variables
    let countdownInterval;
    let isCounting = false;
    let targetDate;
    
    // Initialize theme from localStorage or prefer-color-scheme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    // Start countdown
    startBtn.addEventListener('click', function() {
        if (isCounting) return;
        
        const dateValue = targetDateInput.value;
        const timeValue = targetTimeInput.value;
        
        if (!dateValue || !timeValue) {
            alert('Please select both date and time');
            return;
        }
        
        const [year, month, day] = dateValue.split('-');
        const [hours, minutes] = timeValue.split(':');
        
        targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
        
        if (targetDate <= new Date()) {
            alert('The target time must be in the future.');
            return;
        }
        
        isCounting = true;
        startBtn.disabled = true;
        startCountdown();
    });
    
    // Reset countdown
    resetBtn.addEventListener('click', function() {
        clearInterval(countdownInterval);
        isCounting = false;
        startBtn.disabled = false;
        resetDisplay();
        messageElement.classList.add('hidden');
        alertSound.pause();
        alertSound.currentTime = 0;
        
        if ('vibrate' in navigator) {
            navigator.vibrate(0); // Stop vibration
        }
    });
    
    // Stop alert
    stopAlertBtn.addEventListener('click', function() {
        messageElement.classList.add('hidden');
        alertSound.pause();
        alertSound.currentTime = 0;
        
        if ('vibrate' in navigator) {
            navigator.vibrate(0); // Stop vibration
        }
    });
    
    // Start countdown function
    function startCountdown() {
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
    
    // Update countdown display
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            isCounting = false;
            showCompletion();
            return;
        }
        
        // Calculate time units
        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        
        // Calculate days, months, years
        const startDate = new Date(now);
        const endDate = new Date(targetDate);
        
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();
        
        // Adjust for negative months/days
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        
        if (days < 0) {
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += lastMonth.getDate();
            months--;
        }
        
        // Update display
        document.getElementById('years').textContent = years.toString().padStart(2, '0');
        document.getElementById('months').textContent = months.toString().padStart(2, '0');
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Show completion message and trigger alert
    function showCompletion() {
        // Select random completion message
        const randomIndex = Math.floor(Math.random() * completionMessages.length);
        messageTitle.textContent = "Countdown Complete!";
        messageContent.textContent = completionMessages[randomIndex];
        
        messageElement.classList.remove('hidden');
        
        // Play sound
        alertSound.loop = true;
        alertSound.play().catch(e => console.log('Audio play failed:', e));
        
        // Vibrate if supported (pattern: vibrate for 500ms, pause for 200ms, repeat)
        if ('vibrate' in navigator) {
            navigator.vibrate([500, 200, 500, 200, 500, 200, 500, 200, 500, 200]);
        }
    }
    
    // Reset display to zeros
    function resetDisplay() {
        document.getElementById('years').textContent = '00';
        document.getElementById('months').textContent = '00';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
    
    // Save notes to localStorage when changed
    timerNotes.addEventListener('input', function() {
        localStorage.setItem('countdownNotes', this.value);
    });
    
    // Load saved notes
    function loadNotes() {
        const savedNotes = localStorage.getItem('countdownNotes');
        if (savedNotes) {
            timerNotes.value = savedNotes;
        }
    }
    
    // Initialize
    initTheme();
    loadNotes();
});