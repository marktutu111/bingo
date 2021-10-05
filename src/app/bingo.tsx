import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./bingo.css";
import party from "party-js";




class Bingo extends Component {
    
    _cR:number=0;
    _cB:number=0;
    
    _emojis:Array<string>=["🥝","🍎","🍐"];
    _ut:string="🙅‍♂️";
    
    rows:Array<number>=new Array(1,2,3,4,5);
    cols:number=this.rows.length-1;
    _boxes:Array<number>=[]

    _pws:Array<Array<number>>=[
        [0,1,2,3,4],
        [5,6,7,8,9],
        [10,11,13,14],
        [15,16,17,18,19],
        [20,21,22,23,24],
        [0,5,10,15,20],
        [1,6,11,16,21],
        [2,7,17,22],
        [3,8,13,18,23],
        [4,9,14,19,24],
        [0,6,18,24],
        [20,16,8,4]
    ]

    state={
        selected:[],
        boxes:[],
    };


    componentDidMount(){
        this.reset();
    }

    reset(){
        this._boxes=[];
        this._cR=0;
        this._cB=0;
        this.setState(
            {
                selected:[],
                boxes:[]
            },()=>{
                this._gnums();
                const boxes=this._generateBoxes();
                this.setState(
                    {
                        boxes:boxes
                    }
                );
            }
        )
    }



    _onclick=(e:any)=>{
        const _box=e.target;
        const _id:number=_box.id;
        const key:number=parseInt(_id.toString().split('d')[1]);
        if(key===12)return;
        let selected:Array<number>=this.state.selected;
        if(_box.className.indexOf(" active")>-1){
            e.target.className="box btn";
            selected=selected.filter(i=>i!==key);
        }else {
            e.target.className+=" active";
            selected.push(key);
        };
        this.setState(
            {
                selected:selected
            },this.checkWin
        )
    }



    checkWin=()=>{
        const selected:Array<number>=this.state.selected;
        let _m:Array<number>=[];
        this._pws.forEach((win:Array<number>,i)=>{
            win.forEach((k:number)=>{
                if(selected.indexOf(k)>-1){
                    _m.push(k);
                }
            });

            let _win=win.sort((a,b)=>a-b);
            let _ms=Array.from(new Set(_m)).sort((a,b)=>a-b);
            
            if(_win.every((v,i)=>v===_ms[i])){
                selected.forEach(i=>{
                    try {
                        const d:any=document.querySelector(`#d${i}`);
                        if(d.className.indexOf("rotate-center") <= -1){
                            d.className+=" bounce-top";
                        }
                    } catch (err) {}
                });

                const el:any=document.querySelector('#d12');
                party.confetti(el, {shapes: ["star"]});
                party.sparkles(el);

                this.state.selected.length=0;


            }

            _m.length=0;

        });

    }


    _generateBoxes=()=>this.rows.map((v,i)=>{
        this._cR=i;
        return (
            <tr className="th" key={i.toString()}>
                {this._boxes.map((b,_i)=>{
                    if(this._cR===i && _i<=this.cols){
                        this._cB+=1;
                        let _k:string=(this._cB-1).toString();
                        return (
                            <td key={_k}>
                                <div id={`d${_k}`} onClick={this._onclick.bind(this)} className="box btn">
                                    <span>{ _k }</span>
                                    { _k==='12'?this._ut:this._emojis[Math.floor(Math.random()*this._emojis.length)]}
                                </div>
                            </td>
                        )
                    }
                })}
            </tr>
        )
    });
    
    
    _gnums=()=>{
        let x=0;
        while (x<=24) {
            this._boxes.push(x);
            x+=1;
        }
    };


    render(){

        return(
            <div className="container">
                <div className="row my-5">
                    <div className="col col-md">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th className="text-center">B</th>
                                    <th className="text-center">I</th>
                                    <th className="text-center">N</th>
                                    <th className="text-center">G</th>
                                    <th className="text-center">O</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.boxes.map((box:any)=>box)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

}


export default Bingo;