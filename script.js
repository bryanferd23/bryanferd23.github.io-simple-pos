$(document).ready(function () {
  // Select all sidebar items
  const $sidebarItems = $("aside nav ul li");

  // Select all containers within the main element
  const $containers = $("main > div");

  // Add click event listeners to sidebar items
  $sidebarItems.on("click", function () {
    const targetId = $(this).find("span").html().toLowerCase() + "Container";
    
    // Hide all containers
    $containers.addClass("hidden");
    
    // Show the target container
    $("#" + targetId).removeClass("hidden");
    
    // Update active state of sidebar items
    $sidebarItems.removeClass("bg-gray-200");
    $(this).addClass("bg-gray-200");
  });

  // Trigger click on the first sidebar item to show initial content
  $sidebarItems.first().trigger("click");

  // Function to open the cart modal
  function openCartModal() {
    $("#cartModal").removeClass("hidden");
  }

  // Function to close the cart modal
  function closeCartModal() {
    $("#cartModal").addClass("hidden");
  }

  // Add event listener to the "Open Cart" button
  $("#openCart").on("click", openCartModal);

  // Add event listener to the "Close" button in the modal
  $("#closeModal").on("click", closeCartModal);

  $("main").on("click", "a", function(e) {
    e.preventDefault(); 
    
    // Get the image source, price, and name from the clicked item
    var imgSrc = $(this).find('img').attr('src');
    var price = parseFloat($(this).find('.font-bold').text().replace('$', ''));
    var name = $(this).find('h2').text();
    
    // Create a new image element
    var $flyingImg = $('<img>', {
      src: imgSrc,
      class: 'flying-image'
    });

    // Append the image to the body
    $('body').append($flyingImg);

    // Get the position of the clicked image and the cart button
    var imgOffset = $(this).find('img').offset();
    var cartOffset = $('#openCart').offset();

    // Calculate positions relative to the viewport
    var imgTop = imgOffset.top - $(window).scrollTop();
    var imgLeft = imgOffset.left - $(window).scrollLeft();
    var cartTop = cartOffset.top - $(window).scrollTop();
    var cartLeft = cartOffset.left - $(window).scrollLeft();

    // Set the initial position of the flying image
    $flyingImg.css({
      top: imgTop + 'px',
      left: imgLeft + 'px'
    });

    // Animate the image to the cart
    $flyingImg.animate({
      top: cartTop + 'px',
      left: cartLeft + 'px',
      width: 0,
      height: 0,
      opacity: 0.5
    }, 1000, function() {
      // Remove the flying image after animation
      $(this).remove();
      
      // Add item to cart
      addToCart(name, price, imgSrc);
    });
  });

  // Function to add item to cart
  function addToCart(name, price, imgSrc) {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    var existingItem = cartItems.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      cartItems.push({
        name: name,
        price: price,
        quantity: 1,
        total: price,
        imgSrc: imgSrc
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
  }

  // Function to update cart display
  function updateCartDisplay() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    var $cartItems = $('#cartItems');
    var total = 0;
    
    $cartItems.empty();
    
    cartItems.forEach(function(item, index) {
      $cartItems.append(`
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <img src="${item.imgSrc}" alt="${item.name}" class="w-16 h-16 object-cover mr-4">
          <div class="flex-grow">
            <span class="font-semibold">${item.name}</span>
            <div class="flex items-center mt-1">
              <button class="decrease-quantity px-2 py-1 bg-gray-200 rounded-l" data-index="${index}">-</button>
              <span class="quantity px-2">${item.quantity}</span>
              <button class="increase-quantity px-2 py-1 bg-gray-200 rounded-r" data-index="${index}">+</button>
            </div>
          </div>
          <span class="mx-2">$${item.total.toFixed(2)}</span>
          <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `);
      total += item.total;
    });
    
    $('#cartTotal').text('$' + total.toFixed(2));

    // Add event listeners for remove, increase, and decrease buttons
    $('.remove-item').on('click', function() {
      var index = $(this).data('index');
      removeFromCart(index);
    });

    $('.increase-quantity').on('click', function() {
      var index = $(this).data('index');
      updateQuantity(index, 1);
    });

    $('.decrease-quantity').on('click', function() {
      var index = $(this).data('index');
      updateQuantity(index, -1);
    });
  }

  // Function to remove item from cart
  function removeFromCart(index) {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
  }

  // Function to update quantity
  function updateQuantity(index, change) {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    var item = cartItems[index];
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(index);
    } else {
      item.total = item.quantity * item.price;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartDisplay();
    }
  }

  // Call updateCartDisplay when opening the cart modal
  $("#openCart").on("click", function() {
    updateCartDisplay();
    openCartModal();
  });

  // Add event listener to the "Checkout" button
  $("#checkoutButton").on("click", function() {
    // Add your checkout logic here
    alert("Thank you for your purchase!");
    // Clear the cart
    localStorage.removeItem('cartItems');
    updateCartDisplay();
    closeCartModal();
    //close the modal
    $("#cartModal").addClass("hidden");
  });

});
