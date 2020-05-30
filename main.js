var eventBus = new Vue();

Vue.component("product", {
	props: {
		premium: {
			type: Boolean,
			required: true,
		},
	},
	template: `
			<div class="product">
				<div class="product-image">
					<img v-bind:src="image" alt="" />
				</div>
				<div class="product-info">
					<h1>{{ title }}</h1>
					<p v-if="onStock">In Stock</p>
					<p v-else :class="{outOfStock: !onStock}">Out of stock</p>
					<info-tabs :shipping="shipping" :details="details"></info-tabs>
					<div
						v-for="(variant, index) in variants"
						:key="variant.variantID"
						class="color-box"
						:style="{ backgroundColor: variant.variantColor }"
						@mouseover="updateProduct(index)"
					></div>
					<button
						v-on:click="addToCart"
						:disabled="!onStock"
						:class="{ disabledButton: !onStock }"
					>
						Add to cart
					</button>

					<button v-on:click="removeAddToCart">Remove add</button>

		<products-tabs :reviews="reviews"></products-tabs>
		

			
				</div>
	`,
	data() {
		return {
			product: "Socks",
			selectedVariant: 0,
			brand: "Vue mastery",
			details: ["80% Coton", "20% Polyester", "Gender-neutral"],
			variants: [
				{
					variantID: 2234,
					variantColor: "Green",
					variantImage: "assets/vmSocks-green-onWhite.jpg",
					variantQuantity: 10,
				},
				{
					variantID: 2254,
					variantColor: "Blue",
					variantImage: "assets/vmSocks-blue-onWhite.jpg",
					variantQuantity: 0,
				},
			],
			reviews: [],
		};
	},
	methods: {
		addToCart() {
			this.$emit("add-to-cart", this.variants[this.selectedVariant].variantID);
		},
		removeAddToCart() {
			this.$emit("remove-to-cart");
		},
		updateProduct: function (index) {
			this.selectedVariant = index;
		},
	},
	computed: {
		title() {
			return this.brand + " " + this.product;
		},
		image() {
			return this.variants[this.selectedVariant].variantImage;
		},
		onStock() {
			return this.variants[this.selectedVariant].variantQuantity;
		},
		shipping() {
			if (this.premium) {
				return "Free";
			}
			return 2.99;
		},
	},
	mounted() {
		eventBus.$on("review-submitted", (productReview) => {
			this.reviews.push(productReview);
		});
	},
});

Vue.component("product-review", {
	template: `
	<form class="review-form" @submit.prevent="onSubmit">

	<p v-if="errors.length">
		<b>Please correct the following error(s):</b>
		<ul>
			<li v-for="error in errors"> {{ error }}</li>
		</ul>
	</p>

	<p>
	  <label for="name">Name:</label>
	  <input id="name" v-model="name" placeholder="name">
	</p>
	
	<p>
	  <label for="review">Review:</label>      
	  <textarea id="review" v-model="review"></textarea>
	</p>
	
	<p>
	  <label for="rating">Rating:</label>
	  <select id="rating" v-model.number="rating">
		<option>5</option>
		<option>4</option>
		<option>3</option>
		<option>2</option>
		<option>1</option>
	  </select>
	</p>
		
	<p>
	  <input type="submit" value="Submit">  
	</p>    
  
  </form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: [],
		};
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
				};
				eventBus.$emit("review-submitted", productReview);
				this.name = null;
				this.review = null;
				this.rating = null;
			} else {
				if (!this.name) this.errors.push("Name required.");
				if (!this.review) this.errors.push("Review required.");
				if (!this.rating) this.errors.push("Rating required.");
			}
		},
	},
});

Vue.component("products-tabs", {
	props: {
		reviews: {
			type: Array,
			required: false,
		},
	},
	template: `
	<div>
		<span :class="{activeTab: selectedTab === tab }" 
			class="tab" 
			v-for="(tab, index) in tabs" 
			:key="index"
			@click="selectedTab = tab">
			{{ tab }}
		</span>
		  
		  <div v-show="selectedTab === 'Reviews'"> 
			  <p v-if="!reviews.length">There are no reviews yet.</p>
			  <ul v-else>
				  <li v-for="(review, index) in reviews" :key="index">
					<p>{{ review.name }}</p>
					<p>Rating:{{ review.rating }}</p>
					<p>{{ review.review }}</p>
				  </li>
			  </ul>
		  </div>
	
		  <product-review v-show="selectedTab === 'Make a review'"></product-review>        

		</div>
  `,
	data() {
		return {
			tabs: ["Reviews", "Make a review"],
			selectedTab: "Reviews",
		};
	},
});

Vue.component("info-tabs", {
	props: {
		shipping: {
			required: true,
		},
		details: {
			type: Array,
			required: true,
		},
	},
	template: `
	<div>
		
		  <div>
			<span class="tabs" 
				  :class="{ activeTab: selectedTab === tab }"
				  v-for="(tab, index) in tabs"
				  :key="index"
				  @click="selectedTab = tab"
			>{{ tab }}</span>
		  </div>
  
		  <div v-show="selectedTab === 'Shipping'">
  <p> {{ shipping }}</p>
		  </div>
  
		  <div v-show="selectedTab === 'Details'">
  <ul>
		  <li v-for="detail in details">{{ detail }}</li>
  </ul>
		  </div>
	  
		</div>
  `,
	data() {
		return {
			tabs: ["Shipping", "Details"],
			selectedTab: "Shipping",
		};
	},
});

var app = new Vue({
	el: "#app",
	data: {
		premium: false,
		cart: [],
	},
	methods: {
		updateCart(id) {
			this.cart.push(id);
		},
		removeCart() {
			this.cart.splice(0, 1);
		},
	},
});
Vue.config.devtools = true;
