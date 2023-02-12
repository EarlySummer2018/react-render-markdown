// 控制标题显示隐藏
export  const getNodes = (e) => {
    // const titleTag = [...ulBox.current.childNodes];
    const parentNode = e.target.parentNode;
    const dataIndex = parentNode.getAttribute("data-index");
    const index = showItems.findIndex( el => el.id == dataIndex );
    const tagNum = parentNode.getAttribute("data-tagnum");
    const arr = showItems.slice(index + 1),
      newArr = [];
    for (let i = 0; i < arr.length; i++) {
      const el = arr[i];
      const currentNum = el.tagNum;
      if (currentNum && currentNum > tagNum) newArr.push(el);
      else break;
    }
    console.log('newArr', newArr);
    if (parentNode.className.includes("hidden")) {
      const child = hiddenNodes.get(parentNode);
      if (!child) return [];
      parentNode.classList.remove("hidden");
      let idx = (index+1) > showItems.length ? showItems.length : (index+1)
      const newItems = [...showItems.slice(0, idx), ...child.child, ...showItems.slice(idx)]
      setList(newItems)
      hiddenNodes.delete(parentNode);
    } else {
      hiddenNodes.set(parentNode, { child: newArr });
      parentNode.classList.add("hidden");
      let idx1 = (index + 1) > showItems.length ? showItems.length : (index + 1)
      let idx2 = (idx1 + newArr.length) > showItems.length ? showItems.length : (idx1 + newArr.length)
      const newItems = [...showItems.slice(0, idx1), ...showItems.slice(idx2)]
      setList(newItems)
    }
  };