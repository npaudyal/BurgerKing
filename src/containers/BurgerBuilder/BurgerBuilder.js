import React , { Component } from "react";
import Auxilary from '../../hoc/Auxilary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat:1.3,
    bacon:1.7
} 

class BurgerBuilder extends Component{

   
    state = {
        ingredients : null,
        totalPrice: 4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    }


    componentDidMount() {
        axios.get('https://react-my-burger-8859a.firebaseio.com/ingredients.json').then(response => {
            this.setState({ingredients:response.data})
        }).catch(error => {
            this.setState({error:true})
        })
    }

    updatePurchaseState( ingredients){
      
        const sum = Object.keys(ingredients).map(igKey => {return ingredients[igKey]}).reduce( (sum,el) => {return sum+el },0)
        this.setState({purchasable:sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount =this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)

    }

    removeIngredientHandler = (type) => {
        const oldCount =this.state.ingredients[type];

        if(oldCount <=0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)


    }

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false})
    }
    purchaseContinueHandler = () => {
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer : {
                name: 'Nischal Paudyal',
                address: {
                    street: '5500 Highland drive',
                    zipcode: 72223,
                    country: 'US'
                },
                email: 'npaudyal01@gmail.com',
                
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
        .then(response => this.setState({loading:false, purchasing:false}))
        .catch(error => this.setState({loading:false,purchasing:false}))
    }

    render() {
        const disbaledInfo = {
            ...this.state.ingredients
        }

        for (let key in disbaledInfo){
            disbaledInfo[key] = disbaledInfo[key]<=0
        }


        let orderSummary =null;


        


        let burger = this.state.error ? <p> Ingredients cant be loaded!</p> : <Spinner />
        if(this.state.ingredients){
             burger = (
                <Auxilary>
            <Burger ingredients = {this.state.ingredients} />
            <BuildControls
            ingredientAdded = {this.addIngredientHandler}
            ingredientRemoved = {this.removeIngredientHandler}
            disabled = {disbaledInfo}
            price = {this.state.totalPrice}
            purchasable = {this.state.purchasable}
            ordered ={this.purchaseHandler}
            >
            </BuildControls>
            </Auxilary>
            )
            orderSummary = <OrderSummary price={this.state.totalPrice} ingredients ={this.state.ingredients} purchaseCanceled={this.purchaseCancelHandler} purchaseContinued={this.purchaseContinueHandler}></OrderSummary>

             }

             
        if(this.state.loading){
            orderSummary = <Spinner />
        }
    
        return (
            <Auxilary>
                <Modal show ={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
               {burger}
            </Auxilary>
        );

    }

}

export default withErrorHandler(BurgerBuilder,axios);
