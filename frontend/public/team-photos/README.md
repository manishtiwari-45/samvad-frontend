# Team Photos & Social Links Setup Guide ✨

## ✅ **COMPLETED SETUP**

### **Photo Integration**:
- ✅ Photo paths configured for both team members
- ✅ Fallback icons in case images fail to load
- ✅ Professional circular photo containers with hover effects
- ✅ Proper error handling for missing images

### **Social Media Links**:
- ✅ Clickable GitHub, LinkedIn, and Email links for both members
- ✅ Links open in new tabs with proper security attributes
- ✅ Hover animations and professional styling

## 📸 **HOW TO ADD ACTUAL PHOTOS**

### **Step 1: Prepare Your Photos**
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 400x400px or higher (square aspect ratio)
- **Quality**: High resolution for crisp display

### **Step 2: Replace Placeholder Files**
Replace these files with your actual photos:
```
📁 public/team-photos/
├── 📷 manish-tiwari.jpg     ← Replace with Manish's photo
└── 📷 anuradha-tiwari.jpg   ← Replace with Anuradha's photo
```

### **Step 3: Update Social Media Links**
Edit the links in `LandingPage.jsx` (lines 290-311 and 354-376):

**For Manish Tiwari:**
```jsx
href="https://github.com/YOUR-ACTUAL-GITHUB-USERNAME"
href="https://linkedin.com/in/YOUR-ACTUAL-LINKEDIN"
href="mailto:YOUR-ACTUAL-EMAIL"
```

**For Anuradha Tiwari:**
```jsx
href="https://github.com/YOUR-ACTUAL-GITHUB-USERNAME"
href="https://linkedin.com/in/YOUR-ACTUAL-LINKEDIN"
href="mailto:YOUR-ACTUAL-EMAIL"
```

## 🎯 **CURRENT FEATURES**

### **Photo Display**:
- 128x128px circular containers
- Smooth hover animations
- Gradient fallback backgrounds
- Border effects with team-specific colors
- Automatic fallback to icons if photos fail

### **Social Links**:
- GitHub, LinkedIn, and Email for both members
- Opens in new tabs for external links
- Professional hover effects
- Color-coded for each team member (Manish: accent, Anuradha: purple)

### **Responsive Design**:
- 2-column grid on desktop
- Single column on mobile
- Centered layout with proper spacing
- Smooth animations on scroll

## 🚀 **TESTING**

1. **View the landing page** in your browser
2. **Check photo loading** - should show fallback icons currently
3. **Test social links** - verify they open correctly
4. **Test responsiveness** - resize browser window
5. **Replace photos** when ready and test again

## 📝 **CUSTOMIZATION OPTIONS**

### **Alternative Photo Sources**:
If you prefer external hosting (like Cloudinary, Imgur, etc.):
```jsx
src="https://your-image-host.com/manish-photo.jpg"
src="https://your-image-host.com/anuradha-photo.jpg"
```

### **Add More Social Links**:
You can add Twitter, Instagram, or other platforms by following the same pattern in the social links section.
