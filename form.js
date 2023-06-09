window.Webflow ||= [];
window.Webflow.push(() => {
  setTimeout(() => {
    const tabLinks = Array.from(
      document.querySelector('[px-tabs="tabs-menu"]').children
    );
    const tabsContent = document.querySelectorAll('[px-tabs="tab-content"]');
    const tabBtnsBack = document.querySelectorAll('[px-tabs="btn-back"]');
    const tabBtnsNext = document.querySelectorAll('[px-tabs="btn-next"]');

    const allNames = document.querySelectorAll('[px-tabs="final-name"]');
    const allTotals = document.querySelectorAll('[px-tabs="final-price"]');
    const inputName = document.querySelector('[px-tabs="name"]');

    let currentTab = tabLinks[0];

    tabBtnsNext[0].addEventListener("click", () => {
      allNames[allNames.length - 1].innerHTML = inputName.value;
    });

    tabLinks.forEach((tabLink, index) => {
      const tabLinkBody = tabLink.querySelector(
        '[fs-cmstabs-element="tab-link"]'
      );
      const parentTabTitle = tabsContent[index].querySelector(
        '[px-tabs="parent-step"]'
      ).innerHTML;

      if (parentTabTitle !== "") {
        tabLinkBody.parentElement.classList.add("hidden");
        tabLinkBody.remove();
      }
    });

    const switchIcon = (currentLink) => {
      const currentIdleIcon = currentLink.querySelector(
        '[form-tab="link-idle-icon"]'
      );
      const currentActiveIcon = currentLink.querySelector(
        '[form-tab="link-active-icon"]'
      );

      if (currentIdleIcon && currentActiveIcon) {
        currentActiveIcon.classList.remove("hidden");
        currentIdleIcon.classList.add("hidden");
      } else {
        return;
      }
    };

    switchIcon(currentTab);

    tabLinks.forEach((link) => {
      link.addEventListener("click", () => {
        switchIcon(link);
      });
    });

    tabBtnsNext.forEach((btn) => {
      if (
        !btn.parentElement.parentElement
          .querySelector('[px-tabs="form"]')
          .classList.contains("w-condition-invisible")
      ) {
        btn.classList.add("is-disabled");
      }

      btn.addEventListener("click", () => {
        currentTab = document.querySelector(".w--current");
        tabLinks.forEach((link, index) => {
          if (currentTab == link && !btn.classList.contains("is-disabled")) {
            tabLinks[index + 1].click();
          }
        });
      });
    });

    tabBtnsBack.forEach((btn, index) => {
      if (index == 0) {
        btn.remove();
      }
      btn.addEventListener("click", () => {
        currentTab = document.querySelector(".w--current");
        tabLinks.forEach((link, index) => {
          if (currentTab == link) {
            tabLinks[index - 1].click();
          }
        });
      });
    });

    let activeCards = [];

    tabsContent.forEach((tab, index) => {
      const productCards = tab.querySelectorAll('[px-tabs="product-card"]');
      const tabTitle = tab.querySelector('[px-tabs="tab-title"]').innerHTML;
      const tabSubtitle = tab.querySelector('[px-tabs="tab-subtitle"]')
        .innerHTML;

      productCards &&
        productCards.forEach((card) => {
          const title = card.querySelector('[product-card="name"]').innerHTML;
          const btn = card.querySelector('[product-card="btn"]');
          const prices = card.querySelectorAll('[product-card="price"]');
          const price = prices[0].innerHTML;
          let name;
          const id = `${title
            .replace(/\s/g, "")
            .toLowerCase()}-${tabTitle.replace(/\s/g, "").toLowerCase()}`;

          const productMoreBtns = card.querySelectorAll(
            '[px-tabs="product-more-btn"]'
          );

          const modal = card.querySelector('[px-tabs="product-modal"]');
          productMoreBtns.forEach((moreBtn) => {
            moreBtn.addEventListener("click", () => {
              modal.classList.remove("hidden");
            });
            card
              .querySelector('[px-tabs="modal-close"]')
              .addEventListener("click", () => {
                modal.classList.add("hidden");
              });

            if (!moreBtn.classList.contains("w-condition-invisible")) {
              btn.parentElement.classList.add("hidden");
              card
                .querySelector('[px-tabs="modal-close"]')
                .addEventListener("click", () => {
                  btn.parentElement.classList.remove("hidden");
                });
            }
          });

          prices.forEach((priceHTML) => {
            priceHTML.innerHTML = (+price).toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            });
          });

          btn.value = title;

          if (tabSubtitle !== "") {
            btn.setAttribute("name", tabSubtitle);
            btn.setAttribute("data-name", tabSubtitle);
            name = tabSubtitle;
          } else {
            btn.setAttribute("name", tabTitle);
            btn.setAttribute("data-name", tabTitle);
            name = tabTitle;
          }

          btn.addEventListener("click", () => {
            let toRemove = 0;

            activeCards.forEach((card) => {
              if (card.name === name && card.title !== title) {
                removeActiveCard(card.id);
              }
              if (card.id === id) {
                toRemove++;
                removeActiveCard(card.id);
              }
            });

            if (toRemove === 0) {
              addActiveCard(id, title, price, name);
            }

            calculateTotalPrice();
            renderPriceRows();
          });
        });

      if (index === tabsContent.length - 1) {
        const btn = tab.querySelector('[px-tabs="btn-next"]');
        const submit = document.createElement("button");
        submit.innerHTML = btn.innerHTML;
        submit.classList.add("arrow-btn");
        submit.classList.add("is-dark");
        submit.classList.add("w-inline-block");
        submit.classList.add("is-disabled");
        submit.innerHTML = "Submit";

        const pxTabsAttr = document.createAttribute("px-tabs");
        pxTabsAttr.value = "btn-next";
        submit.setAttributeNode(pxTabsAttr);

        btn.parentElement.appendChild(submit);
        btn.remove();
      }

      const forms = tab.querySelectorAll('[px-tabs="form"]');

      forms.forEach((form) => {
        if (form.classList.contains("w-condition-invisible")) {
          form.remove();
        }
      });
    });

    const addActiveCard = (id, title, price, name) => {
      let contains = 0;
      activeCards.forEach((card) => {
        if (card.title == title && card.name == name) {
          contains++;
        }
      });

      if (contains > 0) return;

      const obj = {};
      obj.id = id;
      obj.title = title;
      obj.price = +price;
      obj.name = name;

      activeCards.push(obj);
    };

    const removeActiveCard = (id) => {
      activeCards.forEach((card, index) => {
        if (card.id == id) {
          activeCards.splice(index, 1);
        }
      });
    };

    const priceCardBtns = document.querySelectorAll('[product-card="btn"]');

    priceCardBtns.forEach((btn, index1) => {
      btn.addEventListener("click", () => {
        if (!btn.parentElement.classList.contains("is-filled")) {
          btn.parentElement.classList.add("is-filled");
          btn.checked = true;

          priceCardBtns.forEach((btn2, index2) => {
            if (
              index1 !== index2 &&
              btn2.parentElement.classList.contains("is-filled")
            ) {
              btn2.parentElement.classList.remove("is-filled");
            }
          });
        } else {
          btn.parentElement.classList.remove("is-filled");
          btn.checked = false;
        }
      });
    });

    let price = 0;

    let priceTotalHTML = document.querySelector('[price-card="total"]');

    priceTotalHTML.innerHTML = (0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });

    document.querySelector('[price-card="hst"]').innerHTML = (0).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD"
      }
    );

    const calculateTotalPrice = () => {
      price = 0;

      activeCards.forEach((card) => {
        price += card.price;
      });

      const hst = 0.14 * price;
      price += hst;

      priceTotalHTML = document.querySelector('[price-card="total"]');
      priceTotalHTML.innerHTML = price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });

      document.querySelector(
        '[price-card="hst"]'
      ).innerHTML = hst.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });

      const totalInput = document.querySelector('[form-tab="total"]');
      totalInput.value = priceTotalHTML.innerHTML;

      allTotals[allTotals.length - 1].innerHTML = priceTotalHTML.innerHTML;
    };

    let priceRows = document.querySelector('[price-card="rows"]');
    priceRows.firstChild.remove();

    const renderPriceRows = () => {
      priceRows = document.querySelector('[price-card="rows"]');
      priceRows.children.length == 0 && (priceRows.innerHTML = "");

      priceRows.children.length > 0 &&
        Array.from(priceRows.children).forEach((row) => {
          row.remove();
        });

      activeCards.forEach((card) => {
        const productRow = document.createElement("div");
        productRow.classList.add("price-card_row");
        const productNameEl = document.createElement("p");
        productNameEl.innerHTML = card.title;
        const productPriceEl = document.createElement("p");
        productPriceEl.innerHTML = card.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });

        const htmlName = document.createAttribute("name");
        htmlName.value = card.name;

        productNameEl.setAttributeNode(htmlName);
        productRow.appendChild(productNameEl);
        productRow.appendChild(productPriceEl);
        priceRows.appendChild(productRow);
      });
    };

    const getRawPrice = (price) => {
      let rawPrice;

      const priceLength = price.innerHTML.replace(/\D/g, "").split("").length;

      for (let i = 0; i < priceLength; i++) {
        if (i <= priceLength - 3 && i <= priceLength - 2) {
          if (rawPrice == undefined) {
            rawPrice = price.innerHTML.replace(/\D/g, "").split("")[i];
          } else {
            rawPrice += price.innerHTML.replace(/\D/g, "").split("")[i];
          }
        }
        if (i == priceLength - 3) {
          rawPrice += ".";
          rawPrice += price.innerHTML.replace(/\D/g, "").split("")[
            priceLength - 2
          ];
        }
        if (i == priceLength - 2) {
          rawPrice += price.innerHTML.replace(/\D/g, "").split("")[
            priceLength - 1
          ];
        }
      }

      return rawPrice;
    };

    const tabContacts = document.querySelectorAll('[px-tabs="form"]');

    const validateForm = (inputs, error, btn, isRequired) => {
      let isValid = false;

      let bools = [];
      inputs.forEach((input) => {
        const isRequired = input.hasAttribute("required");

        if (isRequired) {
          if (input.value != "") {
            isValid = true;
          } else {
            isValid = false;
          }
        } else {
          isValid = true;
        }
        bools.push(isValid);
      });

      isValid = !bools.includes(false);

      if (!isRequired) {
        isValid = true;
      }

      if (isValid) {
        btn.classList.remove("is-disabled");

        if (!error.classList.contains("hidden")) {
          error.classList.add("hidden");
        }
      } else {
        error.classList.remove("hidden");
        btn.classList.add("is-disabled");
      }
    };

    tabContacts.forEach((tabContact) => {
      if (tabContact.classList.contains("w-condition-invisible")) return;
      const contactInputs = tabContact.querySelectorAll("input");
      const contactNextBtn = tabContact.parentElement.querySelector(
        '[px-tabs="btn-next"]'
      );
      const error = tabContact.querySelector('[form-tab="contact-error"]');

      const isRequired =
        tabContact.parentElement.parentElement.querySelector(
          '[px-tabs="tab-required"]'
        ).innerHTML === "Yes"
          ? true
          : false;

      contactInputs.forEach((input) => {
        if (input.type === "checkbox") {
          input.addEventListener("change", () => {
            console.log("changed");
            validateForm(contactInputs, error, contactNextBtn, isRequired);
          });
        } else {
          input.addEventListener("focusout", () => {
            validateForm(contactInputs, error, contactNextBtn, isRequired);
          });
        }
      });
    });
  }, 4000);
  

  
  
  
     // Access a form with then name and ID of 'flowbaseSlider' and name of 'Email Form'
  var form = document.getElementById("flowbaseSlider");

  // Get the value of an input with the ID and Name 'Date' and the value of an input the ID and name 'hidden-amount' and store them in the window object
  var dateInput = form.elements["dateTest"];
  var hiddenAmountInput = form.elements["hidden-amount"];
  window.dateValue = dateInput.value;
  window.hiddenAmountValue = hiddenAmountInput.value;

  // When the form submits the values from the input will append a url string 'https://assurant-storefront-uat.azurewebsites.net/?publictoken=NEWHAVEN' where dob will be equal to the value of the variable that held Date and amount will be equal to the variable that is holds hidden-amount.  The newly created URL will be on the window object as amountURL 
  form.addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create a base URL with the query string parameter for publictoken
    var baseURL = "https://assurant-storefront-uat.azurewebsites.net/?publictoken=NEWHAVEN";

    // Create a new URL object with the base URL
    var newURL = new URL(baseURL);

    // Append the query string parameters for dob and amount using the values from the window object
    newURL.searchParams.append("dob", window.dateValue);
    newURL.searchParams.append("amount", window.hiddenAmountValue);

    // Store the new URL as a global variable
    window.amountURL = newURL;
  });

  //the three variables. Two for the input and the new url with the query paramaters will be console logged when the user submits the form.
  console.log(window.dateValue);
  console.log(window.hiddenAmountValue);
  console.log(window.amountURL);

    });
  
  
  
  
});
