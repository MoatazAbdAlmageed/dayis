// newtab.js - Localized date and time display (Africa/Cairo timezone)

function updateDateTime() {
  const now = new Date();
  
  // Format the date specifically for the Africa/Cairo timezone
  const dateOptions = {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  
  const timeOptions = {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const londonOptions = {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const ksaOptions = {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  try {
    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);
    const londonFormatter = new Intl.DateTimeFormat('en-US', londonOptions);
    const ksaFormatter = new Intl.DateTimeFormat('en-US', ksaOptions);
    
    document.getElementById('date-display').textContent = dateFormatter.format(now);
    document.getElementById('time-display').textContent = timeFormatter.format(now);
    document.getElementById('london-time').textContent = londonFormatter.format(now);
    document.getElementById('ksa-time').textContent = ksaFormatter.format(now);
  } catch (error) {
    console.error('Error formatting world clocks:', error);
    document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    document.getElementById('time-display').textContent = now.toLocaleTimeString();
    document.getElementById('london-time').textContent = now.toLocaleTimeString();
    document.getElementById('ksa-time').textContent = now.toLocaleTimeString();
  }
}

// Initial call and set interval to update every second
updateDateTime();
setInterval(updateDateTime, 1000);
