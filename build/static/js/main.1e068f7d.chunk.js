(this["webpackJsonpsudoku-app"]=this["webpackJsonpsudoku-app"]||[]).push([[0],[,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},,function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(1),u=n.n(r),s=n(8),l=n.n(s),i=(n(14),n.p,n(15),n(2)),c=n.n(i),a=n(4),o=n(3),d=(n(17),n(0)),v=function(e){var t=e.cellRow,n=e.cellCol,r=e.value,s=void 0===r?5:r,l=e.given,i=u.a.useRef(null),c=!l,a=l?"upper-cell given":"upper-cell";return u.a.useEffect((function(){i.current=document.getElementById("sudoku-cell-"+t+"-"+n)}),[]),Object(d.jsx)(d.Fragment,{children:Object(d.jsxs)("div",{id:"sudoku-cell-"+t+"-"+n,"data-row":t,"data-col":n,className:"outer-cell","data-not-given":c,children:[Object(d.jsx)("div",{className:a,children:c?"":s}),Object(d.jsx)("div",{className:"lower-cell","data-notes":""})]})})},f=(n(19),function(e){var t=e.setSelectedCell,n=e.sudoku,r=e.originalSudoku,s=e.invalidCell,l=e.hintCell,i=e.setHintCell,c=u.a.useRef(null);for(var a=[],o=0;o<9;o++)for(var f=0;f<9;f++){var p="0"!==r[o][f];a.push(Object(d.jsx)(v,{cellRow:o,cellCol:f,value:n[o][f],given:p}))}return u.a.useEffect((function(){c.current=document.getElementById("grid-div")}),[]),Object(d.jsxs)("div",{children:[Object(d.jsx)("div",{className:"grid-hor-bar",id:"grid-first-hor-bar"}),Object(d.jsx)("div",{className:"grid-hor-bar",id:"grid-second-hor-bar"}),Object(d.jsx)("div",{className:"grid-ver-bar",id:"grid-first-ver-bar"}),Object(d.jsx)("div",{className:"grid-ver-bar",id:"grid-second-ver-bar"}),Object(d.jsx)("div",{className:"grid-div",id:"grid-div",onClick:function(e){var n=e.target;if(n!==c){if(n=n.parentElement,l&&l!==n&&(l.classList.remove("hintCell"),i(null)),"false"===n.getAttribute("data-not-given"))return;if(s&&n!==s)return void document.querySelector(".sudoku-pad-values").focus();for(var r=c.current.children,u=r.length,a=null,o=0;o<u;o++){var d=r[o];d===n?(d.classList.add("selected-cell"),a=d):d.classList.remove("selected-cell")}t(a),document.querySelector(".sudoku-pad-values").focus()}},children:a})]})}),p=(n(20),n(9));function b(){return(b=Object(a.a)(c.a.mark((function e(t){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="https://steven-sudoku-api.herokuapp.com/sudoku?level="+t,e.next=3,fetch(n).then((function(e){if(!e.ok)throw new Error("Error! Status:",e.status);return e.json()})).then((function(e){return e.data})).catch((function(e){return console.error(e)}));case 3:return r=e.sent,e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function h(e){for(var t=[],n=0;n<9;n++)t.push.apply(t,Object(p.a)(e[n]));return t.join(",")}function j(e){for(var t=[],n=0;n<9;n++){for(var r=[],u=0;u<9;u++)r.push(e[n][u]);t.push(r)}return t}var m=function(e){return b.apply(this,arguments)},x=function(e){var t=e.selectedCell,n=e.sudoku,r=e.setSudoku,s=e.update,l=u.a.useRef(null),i=u.a.useRef(null),c=u.a.useRef(null),a=u.a.useRef(null);function o(e){l.current===e.target?(l.current.setAttribute("disabled",!0),i.current.removeAttribute("disabled"),c.current.style.display="",a.current.style.display="none",c.current.focus()):(i.current.setAttribute("disabled",!0),l.current.removeAttribute("disabled"),a.current.style.display="",c.current.style.display="none")}u.a.useEffect((function(){l.current=document.getElementById("sudoku-pad-cell-values-toggle-button"),l.current.addEventListener("click",o),i.current=document.getElementById("sudoku-pad-notes-toggle-button"),c.current=document.getElementById("sudoku-pad-values"),a.current=document.getElementById("sudoku-pad-notes"),a.current.style.display="none"}),[]);for(var v=[],f=[],p=1;p<10;p++)v.push(Object(d.jsx)("div",{className:"sudoku-pad-digit-button",children:p})),f.push(Object(d.jsx)("div",{className:"sudoku-pad-digit-button",children:p}));return Object(d.jsxs)("div",{className:"sudoku-pad",children:[Object(d.jsxs)("div",{id:"sudoku-pad-buttons",children:[Object(d.jsx)("button",{id:"sudoku-pad-cell-values-toggle-button",disabled:!0,children:"Cell Values"}),Object(d.jsx)("button",{id:"sudoku-pad-notes-toggle-button",onClick:o,children:"Notes"})]}),Object(d.jsx)("div",{tabindex:"0",onClick:function(e){var u=e.target;if(u.classList.contains("sudoku-pad-digit-button")&&t){var s=Number(t.getAttribute("data-row")),l=Number(t.getAttribute("data-col")),i=t.children[0],c=u.innerText;if(i.innerText.trim()===c)return i.innerText="",n[s][l]="0",void r(j(n));i.innerText=c,n[s][l]=c,r(j(n))}},onKeyUp:function(e){if(t){var u=e.key;if(["1","2","3","4","5","6","7","8","9"].includes(u)){var s=Number(t.getAttribute("data-row")),l=Number(t.getAttribute("data-col")),i=t.children[0];if(i.innerText.trim()===u)return i.innerText="",n[s][l]="0",void r(j(n));i.innerText=u,n[s][l]=u,r(j(n))}}},id:"sudoku-pad-values",className:"sudoku-pad-values",children:v}),Object(d.jsx)("div",{onClick:function(e){var n=e.target;if(n.classList.contains("sudoku-pad-digit-button")&&t){var r=t.children[1],u=n.innerText.trim(),l=r.getAttribute("data-notes");if(!l)return r.setAttribute("data-notes",u),r.innerText=u,void s(Math.random());for(var i=(l=l.split(",")).length,c=0;c<i;c++)if(l[c]===u)return l.splice(c,1),l.sort(),r.innerText=l.join(" "),r.setAttribute("data-notes",l.join(",")),void s(Math.random());l.push(u),l.sort(),r.innerText=l.join(" "),r.setAttribute("data-notes",l.join(",")),s(Math.random())}},className:"sudoku-pad-notes",id:"sudoku-pad-notes",children:f})]})},g=(n(21),function(e){var t=e.selectedCell;return Object(d.jsxs)("div",{className:"magnified-cell",id:"magnified-cell",children:[Object(d.jsx)("div",{className:"magnified-cell-upper-cell",children:t.children[0].innerText}),Object(d.jsx)("div",{className:"magnified-cell-lower-cell",children:t.children[1].innerText})]})}),k=(n(22),n(23),function(e){var t=e.setSelectedCell,n=e.setHintCell,u=e.selectedCell,s=e.hintCell,l=e.sudoku,i=(e.resetBoard,Object(r.useState)(null)),v=Object(o.a)(i,2),f=v[0],p=v[1],b=Object(r.useState)(null),j=Object(o.a)(b,2),m=j[0],x=j[1];function g(){return(g=Object(a.a)(c.a.mark((function e(r){var i,a,o,d,v,f,b,j;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=h(l),a="https://steven-sudoku-api.herokuapp.com/sudoku/analysis?puzzle="+i,e.next=4,fetch(a).then((function(e){if(!e.ok)throw new Error("Error! Status:",e.status);return e.json()})).then((function(e){return e.data})).catch((function(e){return console.error(e)}));case 4:if(o=e.sent,d=o.position,v=o.value,f=o.solveWith,b="#sudoku-cell-"+(d[0]-1)+"-"+(d[1]-1),j=document.querySelector(b),!s){e.next=14;break}return s.classList.remove("hintCell"),n(null),e.abrupt("return");case 14:j.classList.add("hintCell"),n(j),u&&u.classList.remove("selected-cell"),t(j),document.querySelector("#sudoku-pad-values").focus(),p("The green cell can be solved with "+f),x(v);case 22:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(d.jsxs)("div",{children:[Object(d.jsx)("button",{onClick:function(e){return g.apply(this,arguments)},id:"hint-button",children:"Get Hint"}),Object(d.jsxs)("div",{className:"hint-message",children:[s?f:"",s?Object(d.jsx)("button",{onClick:function(e){document.querySelector("#solution").innerText=m},className:"solution-button",children:"See Solution"}):"",s?Object(d.jsx)("div",{id:"solution"}):""]})]})}),O=function(){var e=u.a.useState(null),t=Object(o.a)(e,2),n=t[0],r=t[1],s=u.a.useState(null),l=Object(o.a)(s,2),i=l[0],v=l[1],p=u.a.useState(!0),b=Object(o.a)(p,2),h=b[0],O=b[1],y=u.a.useRef(null),C=u.a.useState(null),N=Object(o.a)(C,2),S=N[0],w=N[1],T=u.a.useState(null),L=Object(o.a)(T,2),E=L[0],A=L[1],B=u.a.useState(null),I=Object(o.a)(B,2),R=(I[0],I[1]);if(S){var F=function(e){for(var t=0;t<9;t++)if(e[t].reduce((function(e,t){return"0"===t||(e[t]?e.areDuplicates=!0:e[t]=1),e}),{}).areDuplicates)return!1;for(var n=0;n<9;n++){for(var r=[],u=0;u<9;u++)r.push(e[u][n]);if(r.reduce((function(e,t){return"0"===t||(e[t]?e.areDuplicates=!0:e[t]=1),e}),{}).areDuplicates)return!1}for(var s=0;s<9;s+=3){for(var l=[[],[],[]],i=0;i<3;i++){for(var c,a,o,d=[],v=[],f=[],p=0;p<3;p++)d.push(e[i+s][p]),v.push(e[i+s][p+3]),f.push(e[i+s][p+6]);(c=l[0]).push.apply(c,d),(a=l[1]).push.apply(a,v),(o=l[2]).push.apply(o,f)}for(var b=0,h=l;b<h.length;b++)if(h[b].reduce((function(e,t){return"0"===t||(e[t]?e.areDuplicates=!0:e[t]=1),e}),{}).areDuplicates)return!1}return!0}(S);h&&!F?(n.classList.add("invalid-cell"),O(!1),v(n)):!h&&F&&(i.classList.remove("invalid-cell"),O(!0),v(null)),function(e){for(var t=0;t<9;t++)for(var n=0;n<9;n++)if("0"===e[t][n])return!1;return!0}(S)&&h&&alert("you win!")}function D(){for(var e=document.querySelector("#grid-div").children,t=e.length,u=0;u<t;u++){var s=e[u];s.children[0].innerText="",s.children[1].innerText=""}n&&(n.classList.remove("selected-cell"),r(null)),E&&(E.classList.remove("hintCell"),A(null));var l=document.getElementById("magnified-cell");l&&(l.children[0].innerText="",l.children[1].innerText="")}function q(){return(q=Object(a.a)(c.a.mark((function e(t){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.target.value,e.next=3,m(n);case 3:r=e.sent,y.current=r,D(),w(j(r));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return u.a.useEffect((function(){function e(){return(e=Object(a.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m("one");case 2:t=e.sent,y.current=t,w(j(t));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),S?Object(d.jsxs)("div",{className:"sudoku-board",children:[Object(d.jsx)("div",{className:"sudoku-board-sudoku-grid",children:Object(d.jsx)(f,{setHintCell:A,hintCell:E,setSelectedCell:r,invalidCell:i,sudoku:S,originalSudoku:y.current})}),Object(d.jsx)("div",{className:"sudoku-board-sudoku-pad",children:Object(d.jsx)(x,{selectedCell:n,update:R,sudoku:S,setSudoku:w})}),n?Object(d.jsx)("div",{className:"sudoku-board-magnified-cell",children:Object(d.jsx)(g,{selectedCell:n})}):null,Object(d.jsx)("div",{className:"clearFloat"}),Object(d.jsx)(k,{sudoku:S,selectedCell:n,hintCell:E,setHintCell:A,setSelectedCell:r,resetBoard:D}),Object(d.jsxs)("select",{onChange:function(e){return q.apply(this,arguments)},children:[Object(d.jsx)("option",{value:"one",children:"Level One"}),Object(d.jsx)("option",{value:"two",children:"Level Two"}),Object(d.jsx)("option",{value:"three",children:"Level Three"}),Object(d.jsx)("option",{value:"four",children:"Level Four"}),Object(d.jsx)("option",{value:"five",children:"Level Five"})]})]}):""};var y=function(){return Object(d.jsx)(O,{})},C=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,25)).then((function(t){var n=t.getCLS,r=t.getFID,u=t.getFCP,s=t.getLCP,l=t.getTTFB;n(e),r(e),u(e),s(e),l(e)}))};l.a.render(Object(d.jsx)(u.a.StrictMode,{children:Object(d.jsx)(y,{})}),document.getElementById("root")),C()}],[[24,1,2]]]);
//# sourceMappingURL=main.1e068f7d.chunk.js.map