import React from "react"
import { connect } from "react-redux"
import { NotifyView } from "../../components/Header"
import { clearTxs } from "../../actions/txActions"
import { toggleNotify } from '../../actions/utilActions'
import constants from "../../services/constants"

@connect((store) => {
    return {txs: store.txs,
            utils: store.utils}
})

export default class Notify extends React.Component {

    displayTransactions = () => {
        this.props.dispatch(toggleNotify())
        if(Object.keys(this.props.txs).length > 0){            
            if(this.props.utils.showNotify) {
                this.props.dispatch(clearTxs());
            }
        }
        
        
    }
      
    hashDetailLink(hash){
        const url = constants.KOVAN_ETH_URL + 'tx/'
        return url + hash
    }

    createRecap(type, data){
        if(type == "exchange"){
            // 0.123456 ETH&nbsp;</span>for<span class="amount">&nbsp;12.345678 KNC
            return (
                <div class="title">
                    <span class="amount">{data.sourceAmount.slice(0,8)} {data.sourceTokenSymbol}&nbsp;</span>
                    for
                    <span class="amount">&nbsp;{data.destAmount.slice(0,7)} {data.destTokenSymbol}</span>
                </div>  
            )
            {/* `${data.sourceAmount.slice(0,8)} ${data.tokenSymbol} &nbsp;</span>for<span class="amount">&nbsp;${data.destAmount.slice(0,7)} ${data.destTokenSymbol}` */}
            // return `exchange ${data.sourceAmount.slice(0,7)}${data.sourceAmount.length > 7?'...':''} ${data.sourceTokenSymbol} for ${data.destAmount.slice(0,7)}${data.destAmount.length > 7?'...':''} ${data.destTokenSymbol}`
        } else if (type == "transfer"){
            // return `transfer ${data.amount.slice(0,7)}${data.amount.length > 7?'...':''} ${data.tokenSymbol} to ${data.destAddress.slice(0,7)}...${data.destAddress.slice(-5)}`
            return (
                <div class="title">
                    <span class="amount">{data.amount.slice(0,8)} {data.tokenSymbol}&nbsp;</span>
                    to
                    <span class="amount">&nbsp;{data.destAddress.slice(0,8)}...{data.destAddress.slice(-6)}</span>
                </div>  
            )
        } else {
            return '';
        }
    }

    render() {
        const hashLink = constants.KOVAN_ETH_URL + 'tx/'
        const transactions = Object.keys(this.props.txs).map((hash) => {
            var classTx = "pending"
            switch (this.props.txs[hash].status){
                case "success":
                    classTx = "success"
                    break
                case "fail":
                case "failed":
                    classTx = "fail"
                    break
                default:
                    classTx = "pending"
                    break
            }
            return (
                <li key={hash}>
                    <a class={classTx} href={this.hashDetailLink(this.props.txs[hash].hash)} target="_blank">
                        <div class="title"><span class="amount">{this.createRecap(this.props.txs[hash].type, this.props.txs[hash].data)}</span></div>

                        {/* <div class="title"><span class="amount">0.123456 ETH&nbsp;</span>for<span class="amount">&nbsp;12.345678 KNC</span></div> */}
                        
                        
                        <div class="link">{this.props.txs[hash].hash.slice(0,8)} ... {this.props.txs[hash].hash.slice(-6)}</div>
                    </a>
                </li>
                // <li key={hash}>
                //     <p>{this.props.txs[hash].status}</p>
                //     <p>
                //         {this.createRecap(this.props.txs[hash].type, this.props.txs[hash].data)}
                //     </p>
                //     <p><a href={this.hashDetailLink(this.props.txs[hash].hash)} target="_blank">{this.props.txs[hash].hash}</a></p>
                // </li>
            )
        });
        return (
            <NotifyView displayTransactions={this.displayTransactions}
                    transactionsNum={Object.keys(this.props.txs).length}
                    displayTrans={this.props.utils.showNotify}
                    transactions={transactions} />
        )
    }
}