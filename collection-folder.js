  document.addEventListener("DOMContentLoaded", function () {
    // Function to create and append folder items
    function createFolderItems(container, items, isMobile = false) {
      items.forEach(item => {
        const folderItemDiv = document.createElement('div');
        folderItemDiv.classList.add('header-nav-folder-item', 'header-nav-folder-item--external');

        const linkElement = document.createElement('a');
        linkElement.href = item.fullUrl;
        linkElement.textContent = item.title;
        if (isMobile) {
          linkElement.setAttribute('tabindex', '0');
        }

        folderItemDiv.appendChild(linkElement);
        container.appendChild(folderItemDiv);
      });
    }

    function createMobileFolderItems(container, items) {
      items.forEach(item => {
        const folderItemDiv = document.createElement('div');
        folderItemDiv.classList.add('container', 'header-menu-nav-item', 'header-menu-nav-item--external');

        const linkElement = document.createElement('a');
        linkElement.href = item.fullUrl;
        linkElement.textContent = item.title;
        linkElement.setAttribute('tabindex', '0');

        folderItemDiv.appendChild(linkElement);
        container.appendChild(folderItemDiv);
      });
    }

    function removeExtraFolderContent() {
      document.querySelectorAll('.header-menu-nav-item .header-nav-folder-content').forEach(element => {
        element.remove();
      });
    }

    function processCollection(collection) {
      fetch(`/${collection}?format=json`)
        .then(response => response.json())
        .then(data => {
          const items = data.items;
          if (items && items.length > 0) {
            // Desktop navigation
            const desktopNavItem = document.querySelector(`.header-nav-item a[href="/${collection}"]`).parentElement;
            if (desktopNavItem && !desktopNavItem.classList.contains('header-nav-item--folder')) {
              desktopNavItem.classList.add('header-nav-item--folder');
              desktopNavItem.querySelector('a').classList.add('header-nav-folder-title');

              const dropdownContent = document.createElement('div');
              dropdownContent.classList.add('header-nav-folder-content');
              desktopNavItem.appendChild(dropdownContent);

              createFolderItems(dropdownContent, items);
            }

            // Mobile navigation
            const mobileNavWrapper = document.querySelector('.header-menu-nav-wrapper');
            if (mobileNavWrapper) {
              const collectionLink = mobileNavWrapper.querySelector(`.header-menu-nav-item--collection a[href="/${collection}"]`);
              let position = null;
              if (collectionLink) {
                position = Array.from(mobileNavWrapper.children).indexOf(collectionLink.parentElement);
                collectionLink.parentElement.remove();
              }

              const mobileContainer = document.createElement('div');
              mobileContainer.classList.add('container', 'header-menu-nav-item');

              const mobileAnchor = document.createElement('a');
              mobileAnchor.setAttribute('data-folder-id', `/${collection}`);
              mobileAnchor.href = `/${collection}`;

              const mobileContent = document.createElement('div');
              mobileContent.classList.add('header-menu-nav-item-content');

              const hiddenText = document.createElement('span');
              hiddenText.classList.add('visually-hidden');
              hiddenText.textContent = 'Folder:';

              const folderName = document.createElement('span');
              folderName.textContent = collection.charAt(0).toUpperCase() + collection.slice(1);

              const chevron = document.createElement('span');
              chevron.classList.add('chevron', 'chevron--right');

              mobileContent.appendChild(hiddenText);
              mobileContent.appendChild(folderName);
              mobileContent.appendChild(chevron);

              mobileAnchor.appendChild(mobileContent);
              mobileContainer.appendChild(mobileAnchor);

              const mobileDropdownContainer = document.createElement('div');
              mobileDropdownContainer.classList.add('header-nav-folder-content');
              mobileContainer.appendChild(mobileDropdownContainer);

              createMobileFolderItems(mobileDropdownContainer, items);

              if (position !== null) {
                mobileNavWrapper.insertBefore(mobileContainer, mobileNavWrapper.children[position]);
              } else {
                mobileNavWrapper.appendChild(mobileContainer);
              }
            }

            // Additional Mobile Navigation Structure
            const mobileNavList = document.querySelector('.header-menu-nav-list');
            if (mobileNavList) {
              const mobileNavFolderWrapper = document.createElement('div');
              mobileNavFolderWrapper.setAttribute('data-folder', `/${collection}`);
              mobileNavFolderWrapper.classList.add('header-menu-nav-folder', 'header-menu-nav-folder--active');

              const mobileNavFolderContent = document.createElement('div');
              mobileNavFolderContent.classList.add('header-menu-nav-folder-content');

              const mobileNavControls = document.createElement('div');
              mobileNavControls.classList.add('header-menu-controls', 'container', 'header-menu-nav-item');

              const backButton = document.createElement('a');
              backButton.classList.add('header-menu-controls-control', 'header-menu-controls-control--active');
              backButton.setAttribute('data-action', 'back');
              backButton.href = '/';
              backButton.tabIndex = '0';

              const backChevron = document.createElement('span');
              backChevron.classList.add('chevron', 'chevron--left');
              const backText = document.createElement('span');
              backText.textContent = 'Back';

              backButton.appendChild(backChevron);
              backButton.appendChild(backText);
              mobileNavControls.appendChild(backButton);

              mobileNavFolderContent.appendChild(mobileNavControls);

              createMobileFolderItems(mobileNavFolderContent, items);

              const wrappedNavFolder = document.createElement('div');
              wrappedNavFolder.setAttribute('data-folder', `/${collection}`);
              wrappedNavFolder.classList.add('header-menu-nav-folder', 'header-menu-nav-folder--active');
              wrappedNavFolder.appendChild(mobileNavFolderContent);

              mobileNavList.appendChild(wrappedNavFolder);
            }
          }
        })
        .catch(error => {
          console.error(`Error fetching ${collection} data:`, error);
        });
    }

    const metaTag = document.querySelector('meta[squarehero-plugin="collection-folder"]');
    if (metaTag) {
      const enabled = metaTag.getAttribute('enabled');
      if (enabled === "true") {
        const collections = metaTag.getAttribute('target').split(',');
        collections.forEach(collection => {
          processCollection(collection.trim());
        });
      }
    }

    window.addEventListener('load', removeExtraFolderContent);
  });
