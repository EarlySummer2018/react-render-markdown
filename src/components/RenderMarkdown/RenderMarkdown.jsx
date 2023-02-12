import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';//引入
import url from '../../static/MySQL.md'
import 'github-markdown-css';
import remarkGfm from 'remark-gfm';// 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw'// 解析标签，支持html语法
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter' // 代码高亮
//高亮的主题，还有很多别的主题，可以自行选择
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './RenderMarkdown.css'
import NavList from './navList';

const RenderMarkdown = () => {
    const [mdContent, setMdContent] = useState('')
    const [nodeList, setNodeList] = useState([])
    useEffect(() => {
        fetch(url)
            .then(res => res.text())
            .then(text => {
                setMdContent(text)
                addAnchor()
            });
    }, []);

    const addAnchor = () => {
        const ele = document.getElementsByClassName('markdown-body')[0];
        let eid = 0;
        const tagArr = ["H1", "H2", "H3", "H4", "H5", "H6"];
        for (let i = 0; i < ele.childNodes.length; i++) {
            const e = ele.childNodes[i];
            if (tagArr.includes(e.nodeName)) {
                let a = document.createElement('a');
                a.setAttribute('id', '#' + eid);
                a.setAttribute('class', 'anchor-title');
                a.setAttribute('href', '#' + eid);
                a.innerText = ' '
                e.appendChild(a);
                eid++;
            }
        }
        setNodeList(ele.childNodes)
    }
    const contentDom = useRef(null)
    const [active, setActive] = useState(0)
    const handleScroll = () => {
        const tagArr = ["H1", "H2", "H3", "H4", "H5", "H6"];
        const hx = [...contentDom.current.childNodes[0].childNodes].filter(el=>tagArr.includes(el.nodeName))
        const scrollTop = contentDom.current.scrollTop
        const dom = hx.find(el => el.offsetTop === scrollTop||(el.offsetTop - scrollTop>0 && el.offsetTop - scrollTop < 10))
        if(!dom) return
        console.log();
        const id =Number(dom.lastChild.getAttribute('id').slice(1))
        console.log(id);
        setActive(id)
    }
    return (
        <div className='box'>
            <NavList nodeList={nodeList} active={active}></NavList>
            <div className='md-content' ref={contentDom} onScroll={handleScroll}>
                <ReactMarkdown
                    className='markdown-body'
                    children={mdContent}
                    remarkPlugins={[remarkGfm, { singleTilde: false }]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={tomorrow}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default RenderMarkdown