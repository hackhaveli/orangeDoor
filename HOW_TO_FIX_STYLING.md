# QUICK FIX - Add styles.css to index.html

## Problem:
Your index.html has embedded CSS (inside `<style>` tags) but NOT the external `styles.css` that has the About and Resources improvements.

## Solution:
Add this line AFTER line 12 in your index.html:

```html
<link rel="stylesheet" href="styles.css">
```

## Exact location:
```html
<link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght=700;800&family=Open+Sans:wght=300;400;600;700&display=swap"
    rel="stylesheet">

<!-- ADD THIS LINE: -->
<link rel="stylesheet" href="styles.css">

<style>
    /* existing inline styles... */
```

## Why this fixes it:
- The `styles.css` file has the improved About section (line-height: 2.2)
- It has the Resources section with orange-bordered cards
- Adding this link will apply all those improvements!

## After adding the link:
1. Save index.html
2. Refresh your browser (http://localhost:5000/)
3. The About section should have much better spacing!

That's it! 🎉
