import React, { useEffect, useRef, useState } from "react";
import "./navList.css";
const NavList = ({ nodeList, active }) => {
  const navBox = useRef(null);
  const ulBox = useRef(null)
  const [list, setList] = useState([]);
  // 开始索引
  const [startIndex, setStartIndex] = useState(0);
  // 计算上下空白区域
  const [blankStyle, setBlankStyle] = useState({});
  const [showItems, setShowItems] = useState([]);
  useEffect(() => {
    const tagArr = ["H1", "H2", "H3", "H4", "H5", "H6"];
    const titleTag = [...nodeList].filter((el) => tagArr.includes(el.nodeName));
    setList(rewrite(titleTag));
  }, [nodeList]);
  useEffect(() => {
    const maximumCapacity = ~~(navBox.current.offsetHeight / 35) + 2
    let endIndex = startIndex + maximumCapacity * 3;
    if (!list[endIndex]) endIndex = list.length - 1;
    let startIdx = 0;
    if (startIndex <= maximumCapacity) startIdx = 0;
    else startIdx = startIndex - maximumCapacity;
    setShowItems(list.slice(startIdx, endIndex));
    setBlankStyle({
      paddingTop: startIdx * 35 + "px",
      height: list.length * 35 + "px",
    });
  }, [startIndex, list]);
  const handleClickFun = (e, link) => {
    e.preventDefault();
    if (link.href) {
      // setActiveTitle(link.key);
      // 找到锚点对应得的节点
      let element = document.getElementById(link.href);
      // 如果对应id的锚点存在，就跳滚动到锚点顶部
      element && element.scrollIntoView({ block: "start" });
    }
  };

  const handleScroll = () => {
    const animationFrame = window.requestAnimationFrame;
    const fps = 30;
    const interval = 1000 / fps;
    let timeNow = Date.now();
    function animation() {
      const now = Date.now();
      handleScrollEvent();
      if (now - timeNow >= interval) {
        timeNow = now;
        animationFrame(animation);
      }
    }
    animationFrame(animation);
  };

  const handleScrollEvent = () => {
    const currentIndex = ~~(navBox.current.scrollTop / 35);
    if (startIndex === currentIndex) return;
    setStartIndex(currentIndex);
  };

  const rewrite = (titleTag) => {
    let deep = 0,
      prevTag = 0,
      eid = 0,
      navList = [];
    for (let i = 0; i < titleTag.length; i++) {
      const element = titleTag[i];
      const nextTag = titleTag[i + 1];
      let isParent = false;
      if (nextTag && nextTag.nodeName.slice(-1) > element.nodeName.slice(-1)) {
        isParent = true;
      }
      const obj = {
        type: element.nodeName,
        id: eid,
        key: eid,
        isParent,
        title: element.innerText,
        href: `#${eid}`,
        tagNum: Number(element.nodeName.slice(-1)),
        index: String(i),
      };
      navList.push(obj);
      eid++;
    }
    const newNavList = [...navList].sort((a, b) => a.tagNum - b.tagNum);
    newNavList.forEach((el, i) => {
      if (el.tagNum !== prevTag) deep += 1;
      el.className = `toc-deep-${deep}`;
      prevTag = el.tagNum;
    });
    return navList;
  };

  return (
    <div className="nav-left" ref={navBox} onScroll={handleScroll}>
      <ul style={blankStyle} ref={ulBox}>
        {showItems.map((nodes, i) => (
          <li
            key={nodes.key}
            data-index={nodes.id}
            data-tagnum={nodes.tagNum}
            className={`${active === nodes.key ? "active" : null} ${nodes.className}`}
          >
            {/* 标题显示隐藏按钮 */}
            {/* {nodes.isParent ? (
              <i className="icon"></i>
            ) : (
              ""
            )} */}
            <a
              href={nodes.href}
              onClick={(e) => {
                handleClickFun(e, nodes);
              }}
            >
              {nodes.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(NavList);
