import React, {Component} from 'react';
import './App.css';
import CryptoItem from 'components/CryptoItem';

interface AppState {
    cryptoList: string[];
    cryptoInfo: {[name: string]: {price: number, change: number}};
    inputValue: string;
    timer: any
}

const key = 'key';

class App extends Component<Readonly<{}>, AppState> {
    constructor(props: AppState) {
        super(props);
        this.state = {
            cryptoList: ['Dogecoin'],
            cryptoInfo: {},
            inputValue: '',
            timer: null
        };
        // this.updateCrypto();
    }


    componentDidMount() {
        super.componentDidMount?.();
        this.updateInfo();
        this.setState({timer: setInterval(this.updateInfo, 5000)});
    }


    componentWillUnmount() {
        super.componentWillUnmount?.();
        clearInterval(this.state.timer);
    }

    updateInfo = () => {
        this.fetchCrypto().then(newInfo => this.setState({cryptoInfo: newInfo}));
    }

    fetchCrypto = async () => {
        const newInfo: typeof this.state.cryptoInfo = {};
        for (const name of this.state.cryptoList) {
            await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${name}&tsyms=USD&api_key=${key}&gt`)
                .then(res => res.json())
                .then(data => {
                    const info = {price: data['USD'], change: 0};
                    const prevInfo = this.state.cryptoInfo[name];
                    if (prevInfo) {
                        info.change = info.price - prevInfo.price;
                    }
                    newInfo[name] = info;
                });
        }
        return newInfo;
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({inputValue: e.target.value});
    }

    handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${this.state.inputValue}&tsyms=USD&api_key=${key}&gt`)
            .then(res => res.json())
            .then(res => {
                if (res?.Response !== 'Error') {
                    this.setState(prevState => ({
                        cryptoList: [...prevState.cryptoList, this.state.inputValue]
                    }), this.updateInfo);
                }
            });
    }

    handleDelete(name: string) {
        this.setState(prevState => ({
            cryptoList: prevState.cryptoList.filter(n => n !== name)
        }), this.updateInfo);
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.inputValue}
                />
                <button
                    onClick={this.handleClick}
                >Add</button>
                <ul>
                    {
                        Object.entries(this.state.cryptoInfo).map(([name, info]) => (
                            <CryptoItem
                                key={name}
                                name={name}
                                price={info.price}
                                change={info.change}
                                onDelete={() => this.handleDelete(name)}
                            />
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default App;
