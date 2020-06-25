document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById('itemForm');
    let highlightArea = document.getElementById('highlight');
    chrome.storage.sync.get(stored => {
      console.log(stored.content);
      highlightArea.value = stored.content
    });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      let value = e.target.children.highlight.value
      console.log(value)
    })
  }, false);
