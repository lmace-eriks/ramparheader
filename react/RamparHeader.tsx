import React, { useEffect, useState, ReactChildren, useRef } from "react";
import { canUseDOM } from "vtex.render-runtime";
import { createPortal } from "react-dom";

import styles from "./styles.css";

interface RamparHeaderProps {
  children: ReactChildren | any
}

const RamparHeader: StorefrontFunctionComponent<RamparHeaderProps> = ({ children }) => {
  const openGate = useRef(true);
  const [device, setDevice] = useState("unknown");
  const [pageIsPDP, setPageIsPDP] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [softHeader, setSoftHeader] = useState(false);
  const trigger = useRef<any>();


  // Create Destroy window message listener.
  // Marketing wants PDP header to have solid black background.
  useEffect(() => {
    if (!canUseDOM) return;
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    }
  });

  // Create / Destroy Intersection Observer.
  useEffect(() => {
    if (device === "unknown") return; // Prevents observer from being blank. - LM

    const observer: IntersectionObserver = new IntersectionObserver(entries => {
      const entry: IntersectionObserverEntry = entries[0];
      setSoftHeader(entry.isIntersecting ? false : true);
    }, { threshold: 0, rootMargin: "0px" });

    observer.observe(trigger.current);
    return () => {
      observer.unobserve(trigger.current);
    }
  });

  useEffect(() => {
    if (!canUseDOM || !openGate.current) return;
    openGate.current = false;

    const isMobile = window.innerWidth < 1026;
    setDevice(isMobile ? "mobile" : "desktop");
  });

  const handleMessage = (e: any) => {
    const eventName = e.data.eventName;
    if (eventName === "vtex:productView") setPageIsPDP(true);
  }

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  }

  const toggleSearch = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) setTimeout(() => { setInputFocus() }, 250);
  }

  const setInputFocus = () => {
    const searchInputElement: any = document.querySelector(`.${styles.mobileSearchContainer} input`)!;
    searchInputElement.focus();
  }

  const MenuDrawer = () => (<>
    <button onClick={toggleMenu} aria-label="Close Menu" className={styles.drawerOverlay}></button>
    <div className={styles.mobileMenuDrawer}>
      <div data-drawer="true" className={styles.logoContainer}>
        {children[0]} {/*  Site Logo */}
      </div >
      <div className={styles.navigationContainer}>
        {children[1]}{/*  Navigation Element */}
      </div>
      <button onClick={toggleMenu} className={styles.closeMobileMenuButton}>Close Menu</button>
    </div>
  </>
  );

  const SearchIcon = () => (
    <svg fill="none" width="16" height="16" viewBox="0 0 16 16" data-active={showSearchBar} className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg">
      <path d="M15.707 13.293L13 10.586C13.63 9.536 14 8.311 14 7C14 3.14 10.859 0 7 0C3.141 0 0 3.14 0 7C0 10.86 3.141 14 7 14C8.312 14 9.536 13.631 10.586 13L13.293 15.707C13.488 15.902 13.744 16 14 16C14.256 16 14.512 15.902 14.707 15.707L15.707 14.707C16.098 14.316 16.098 13.684 15.707 13.293ZM7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C9.761 2 12 4.239 12 7C12 9.761 9.761 12 7 12Z" fill="currentColor"></path>
    </svg>
  );

  if (device === "mobile") {
    return (
      <>
        <div ref={trigger} className={styles.trigger}></div>
        <header className={styles.container} data-softheader={softHeader} data-pageispdp={pageIsPDP}>
          <div className={styles.backgroundColor}></div>
          <button aria-label={openMenu ? "Close Navigation Menu" : "Open Navigation Menu"} onClick={toggleMenu} className={styles.hamburgerButton}>
            <div className={styles.hamburgerLine}></div>
            <div className={styles.hamburgerLine}></div>
            <div className={styles.hamburgerLine}></div>
          </button>
          <div className={styles.logoContainer}>
            {children[0]} {/*  Site Logo */}
          </div >
          <div className={styles.mobileSearchButtonContainer}>
            <button aria-label={showSearchBar ? "Hide Search Bar" : "Show Search Bar"} onClick={toggleSearch} className={styles.mobileSearchButton}>
              <SearchIcon />
            </button>
          </div>
          {showSearchBar && <div className={styles.mobileSearchContainer}>
            {children[2]}{/*  Search Bar Element */}
          </div>}
        </header>
        {openMenu && createPortal(<MenuDrawer />, document.body)}
      </>
    );
  } else if (device === "desktop") {
    return (
      <>
        <div ref={trigger} className={styles.trigger}></div>
        <header data-softheader={softHeader} data-pageispdp={pageIsPDP} className={styles.container} >
          <div className={styles.backgroundColor}></div>
          <div className={styles.logoContainer}>
            {children[0]} {/*  Site Logo */}
          </div >
          <div className={styles.navigationContainer}>
            {children[1]}{/*  Navigation Element */}
          </div>
          <div className={styles.searchContainer}>
            {children[2]}{/*  Search Bar Element */}
          </div>
        </header>
      </>
    );
  } else {
    return (
      <header></header>
    )
  }
}

RamparHeader.schema = {
  title: "Rampar Header",
  type: "object",
  properties: {

  }
}

export default RamparHeader;
