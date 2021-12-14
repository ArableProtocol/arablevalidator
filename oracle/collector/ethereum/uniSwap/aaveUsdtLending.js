const Web3 = require('web3');
const { aaveLending_abi } = require('../../libs/abis');
const { lendingPool, usdtAddress } = require('../../libs/address');

async function aaveLending_usdt(){
    try{
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const poolContract = new web3.eth.Contract(aaveLending_abi, lendingPool)
        const lendingdata = await poolContract.methods.getReserveData(usdtAddress).call()
        const currentLendingRate = await lendingdata[3]/1e25
        const stableBorrowRate = await lendingdata.currentStableBorrowRate/1e25
        const variedBorrowRate = await lendingdata.currentVariableBorrowRate/1e25
        //console.log('lending rate: ' + currentLendingRate + '%, Stable borrow rate: ' + stableBorrowRate +'%, Varied borrow rate: ' +variedBorrowRate + '%')
        
        return{
            currentLendingRate,
            stableBorrowRate,
            variedBorrowRate,
        }
    }
    catch(error){
        console.log(error)
    }
}

exports.aaveLending_usdt = aaveLending_usdt;