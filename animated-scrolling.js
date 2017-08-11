var AnimatedScrolling = {
  /**
   * Helpers.
   */
  documentVerticalScrollPosition: function() {
    if (self.pageYOffset) return self.pageYOffset // Firefox, Chrome, Opera, Safari.
    if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop // Internet Explorer 6 (standards mode).
    if (document.body.scrollTop) return document.body.scrollTop // Internet Explorer 6, 7 and 8.
    return 0  // None of the above.
  },

  viewportHeight: function() { return (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight },

  documentHeight: function() { return (document.height !== undefined) ? document.height : document.body.offsetHeight },

  documentMaximumScrollPosition: function() { return this.documentHeight() - this.viewportHeight() },

  verticalClientPositionByElement: function(element) { return element.getBoundingClientRect().top },

  /**
   * @param {DOMElement} currrentPosition The starting position
   * @param {DOMElement} targetPosition The ending position
   */
  scrollVerticalTickToPosition: function(currentPosition, targetPosition) {
    var fps = 60
    var filter = 0.2
    var difference = parseFloat(targetPosition) - parseFloat(currentPosition)

    // Snap, then stop if arrived.
    var arrived = (Math.abs(difference) <= 0.5)
    if (arrived) {
        // Apply target.
        scrollTo(0.0, targetPosition)
        return
    }

    // Filtered position.
    currentPosition = (parseFloat(currentPosition) * (1.0 - filter)) + (parseFloat(targetPosition) * filter)

    // Apply target.
    scrollTo(0.0, Math.round(currentPosition))

    // Schedule next tick.
    setTimeout("AnimatedScrolling.scrollVerticalTickToPosition("+currentPosition+", "+targetPosition+")", (1000 / fps))
  },

  /**
   * @param {DOMElement} element The DOM element to scroll to.
   * @param {Integer} padding Top padding to apply above element.
   */
  scrollVerticalToElement: function(element, padding) {
    if (element == null) {
      console.log('Element does not exist in the DOM')
      return
    }

    var targetPosition = this.documentVerticalScrollPosition() + this.verticalClientPositionByElement(element) - padding
    var currentPosition = this.documentVerticalScrollPosition()
    var maximumScrollPosition = this.documentMaximumScrollPosition()
    if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition

    // Start animation.
    this.scrollVerticalTickToPosition(currentPosition, targetPosition)
  }
}