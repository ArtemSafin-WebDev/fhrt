// Функция инициализации табов

function initializeTabs(element, activeTab = 1) {
  if (!element) {
    throw new Error('Нет элемента для инициализации табов')
  }

  const tabsControls = Array.from(element.querySelectorAll('.js-tab-button'))
  const tabs = Array.from(element.querySelectorAll('.js-tab'))
  const tabsControlsCount = tabsControls.length
  const tabsCount = tabs.length
  

  if (tabsControlsCount !== tabsCount) {
    throw new Error('Количество элементов управления не соответствует количеству табов')
  } else if (tabsControlsCount === 0) {
    throw new Error('Отсутствуют элементы управления')
  } else if (tabsCount === 0) {
    throw new Error('Отсутствуют табы')
  }

  

  const setActiveTab = activeTab => {
    tabsControls.forEach((button, index) => {
      if (index === activeTab - 1) {
        button.classList.add('active')
      } else {
        button.classList.remove('active')
      }
    })
    tabs.forEach((tab, index) => {
      if (index === activeTab - 1) {
        // tab.style.display = 'flex';
        tab.classList.add('active')
      } else {
        // tab.style.display = 'none';
        tab.classList.remove('active')
      }
    })
  }


  const dispatchTabChange = (activeTab) => {
    const tabChangeEvent = new CustomEvent('tabchange', {
      bubbles: true,
      detail: { tabID: activeTab.getAttribute('id') }
    });

    activeTab.dispatchEvent(tabChangeEvent)
  }

  tabsControls.forEach(button =>
    button.addEventListener('click', function(event) {
      event.preventDefault()
      const activeTab = tabsControls.indexOf(this) + 1
      if (this.disabled === true) {
        return false
      } else {
        setActiveTab(activeTab)
        dispatchTabChange(tabs[activeTab - 1])
      }
    })
  )

  setActiveTab(activeTab)
  dispatchTabChange(tabs[activeTab - 1])
}

function makeTabsController() {
  return initializeTabs
}

function setTabsOnPage() {
  const tabContainers = Array.from(document.querySelectorAll('.js-tabs-container'))

  if (tabContainers.length > 0) {
    tabContainers.forEach(tabContainer => {
      const initializeTab = makeTabsController()
      let tabToActivate = null

      const activeTab = tabContainer.querySelector('.js-tab.active');
      if (activeTab) {
        const index = [...activeTab.parentElement.children].indexOf(activeTab);
        tabToActivate = index + 1;
      }

      if (tabToActivate) {
        initializeTab(tabContainer, tabToActivate)
      } else {
        initializeTab(tabContainer, 1)
      }

    })
  }
}



export default setTabsOnPage
