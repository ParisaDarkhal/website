// script.js - Form Handler for AI Assessment Form

// Solution 1: Using Google Apps Script Web App (Recommended)
// This is the most reliable way to save to Google Docs

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('assessment-form');
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Change button state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            business: formData.get('business'),
            challenge: formData.get('challenge'),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        try {
            // Method 1: Send to Google Apps Script
            await sendToGoogleScript(data);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage();
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});

// Function to send data to Google Apps Script
async function sendToGoogleScript(data) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// Alternative Solution 2: Send via Email using EmailJS
// First, include EmailJS library in your HTML: <script src="https://cdn.emailjs.com/dist/email.min.js"></script>

const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

async function sendViaEmailJS(data) {
    // Initialize EmailJS (call this once when page loads)
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    const templateParams = {
        to_email: 'your-email@example.com',
        from_name: data.name,
        from_email: data.email,
        business_name: data.business,
        challenge: data.challenge,
        timestamp: data.timestamp
    };

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

// Alternative Solution 3: Send to your own backend endpoint
async function sendToBackend(data) {
    const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// UI Feedback Functions
function showSuccessMessage() {
    // Create success message element
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
    successMsg.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Assessment submitted successfully! We'll be in touch soon.</span>
        </div>
    `;
    
    document.body.appendChild(successMsg);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 5000);
}

function showErrorMessage() {
    // Create error message element
    const errorMsg = document.createElement('div');
    errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorMsg.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Something went wrong. Please try again or contact us directly.</span>
        </div>
    `;
    
    document.body.appendChild(errorMsg);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        errorMsg.remove();
    }, 5000);
}

// Form validation helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!validateEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.business.trim()) {
        errors.push('Business name is required');
    }
    
    if (!data.challenge.trim()) {
        errors.push('Please describe your biggest challenge');
    }
    
    return errors;
}

/* 
SETUP INSTRUCTIONS:

For Google Apps Script (Recommended):
1. Go to script.google.com
2. Create a new project
3. Paste this Google Apps Script code:

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Create or open Google Doc
    const docName = `AI Assessment - ${data.name} - ${new Date().toDateString()}`;
    const doc = DocumentApp.create(docName);
    
    // Add content to the document
    const body = doc.getBody();
    body.appendParagraph('AI ASSESSMENT SUBMISSION').setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('');
    body.appendParagraph(`Name: ${data.name}`);
    body.appendParagraph(`Email: ${data.email}`);
    body.appendParagraph(`Business: ${data.business}`);
    body.appendParagraph(`Challenge: ${data.challenge}`);
    body.appendParagraph(`Submitted: ${data.timestamp}`);
    body.appendParagraph(`User Agent: ${data.userAgent}`);
    
    // Optionally, you can also save to Google Sheets
    // const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    // sheet.appendRow([data.name, data.email, data.business, data.challenge, data.timestamp]);
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', docId: doc.getId()}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

4. Deploy as web app with "Execute as: Me" and "Who has access: Anyone"
5. Copy the web app URL and replace GOOGLE_SCRIPT_URL in the JavaScript

For EmailJS:
1. Sign up at emailjs.com
2. Create an email service and template
3. Replace the EmailJS constants with your actual values

For Backend Solution:
1. Set up your own server endpoint to receive the data
2. Use that endpoint to save to Google Docs via Google Docs API
*/