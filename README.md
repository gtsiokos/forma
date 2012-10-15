# Introduction
With FormaJS you can build forms client-side without worrying about anti-spam techniques.

# Getting Started
Let's make a comment form structure and assign into a variable:
```javascript
var structure = {
  method:'POST',
  action:'comment.php',
  attrs : { "id":'comment-form' },
  collections:[
    { type:'text', for:'first-name', label:'First Name' },
    { type:'text', for:'last-name', label:'Last Name' },
    { type:'text', for:'email', label:'Email', required:true },
    { type:'text', for:'subject', label:'Subject', required:true },
    { type:'textarea', for:'message', label:'Your message', required:true },
    { type:'submit', value:'Send' }
};
```
Now all we have to do is to place the form in our site:
```javascript
$('#new-comment').forma(structure);
```

The resulting html will be:
```html
<form id="comment-form" method="POST" action="comment.php">
  <label for="first-name">First Name</label>
  <input type="text" id="first-name">
  <label for="last-name">Last Name</label>
  <input type="text" id="last-name">
  <label for="email">
    <em title="Required field">*</em>
    Email
  </label>
  <input type="text" id="email">
  <label for="subject">
    <em title="Required field">*</em>
    Subject
  </label>
  <input type="text" id="subject">
  <label for="message">
    <em title="Required field">*</em>
    Your message
  </label>
  <textarea id="message"></textarea>
  <input type="submit" value="Send">
</form>
```

# More Options

### Fieldsets are supported
```javascript
collections:[
  {
    fieldset:'Personal Information',
    inputs: [
      { type:'text', for:'first-name', label:'First Name' },
      { type:'text', for:'last-name', label:'Last Name' },
      { type:'text', for:'email', label:'Email' }
    ]
  },
  {
    fieldset:'Credit Card Information',
    // blahblah
  }
]
```
