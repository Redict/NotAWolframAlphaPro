import z from "./lib/zombular.js"
// import { sample } from "./data.js"
import { req } from "./wa.js";
//import "./style.css"

let Styles = z._style(`
@import url('https://fonts.googleapis.com/css?family=PT+Sans&display=swap');

* { box-sizing: border-box; }
html { font: 400 10px/15px 'PT Sans', sans-serif }
body { margin: 0; }

.aqb { color: #678e9c; }

.fs16 { font-size: 16px; }

.mgr18 { margin-right: 18px; }
.mgt10 { margin-top: 10px; }
.mgb10 { margin-bottom: 10px; }
.mgl20 { margin-left: 20px; }

.fl1 { flex: 1; }
.flex { display: flex; }

.query { min-width: 100px; max-height: 28px; min-height: 14px; width: 100%; }
.content { display: flex; flex-flow: column wrap; align-items: center; height: 100%}
.hidden { display: none; }
.shown { display: block; }
`);

let processPods = d => {
    if (d.length <= 0) return [];
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(d, "application/xml");
    return Array.from(oDOM.getElementsByTagName("pod"));
};

let parseSubpods = pod => {
    console.log(pod);
    let subpods = Array.from(pod.getElementsByTagName("subpod"));
    return subpods.map(subpod => Array.from(subpod.getElementsByTagName("img")).map(img => {
        if (subpod.getAttribute("title") === "Possible intermediate steps") {
            return [
                z({is: 'button', onclick(e) {
                    let sbso = e.target.nextElementSibling;
                    sbso.className = sbso.className === "hidden" ? "shown": "hidden";
                    z.update();
                }
                }, "Показать шаги"),
                z._div.hidden(z("<", img.outerHTML))
            ];
        }
        return z("<", img.outerHTML);
    }
    ))
};

let sample = "";
let v = "";
let pods = [];
let pods_objs = [];
let sbs_pods_objs = [];

let Pods = [z.mgl20(
        z._input.query({
            oninput(e) { v = e.target.value; z.update()},
            onkeydown(e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    req(e.target.value).then(e => e.text().then(e => pods = processPods(e)).then(z.update));
                }
            },
            placeholder: "Введите ваш запрос :)"
        }),
        e => pods.map(pod => z.pod({on$created(e) { pods_objs.push(e.target);}, id: pod.getAttribute("id")}, [
        e => z.mgr18.aqb.fs16.mgt10.mgb10(`${pod.getAttribute("title")}:`),
        e => z.content(parseSubpods(pod))
    ])
    )
)];

const Body = z({on$created(e) {
        pods = [];
        pods_objs = [];
        sbs_pods_objs = [];
    }
}, '', Styles, z.content(Pods) );
z.setBody(Body);
// req("y''=y'+x").then(e => e.text().then(e => pods = processPods(e)).then(z.update));