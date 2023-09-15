import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './ListingForm.css'
import { createListing, postImage } from '../../store/listings';
import noCow from '../../images/noCow.png';
import { fetchListing, updatedListing } from '../../store/listings';


const ListingForm = () => {
    //only update should have a productId
    const {productId} = useParams();

    const history = useHistory();
    const dispatch = useDispatch();
    // const listing = useSelector(state => state.listings.singleListing)
    const listings = Object.values(
        useSelector(state => state.listings.allListings)
    )
    const listing = listings.filter(listing => listing.id === +productId)[0]

    let listingPhoto = '';
    if (listing && listing.images) listingPhoto = listing.images[0].url
    
    // const [photo, setPhoto] = useState(listingPhoto)
    const [photo, setPhoto] = useState(listing?.images ? listing.images[0].url :  '')
    const [name, setName] = useState(listing?.name || '')
    // const [category, setCategory] = useState('')
    const [description, setDescription] = useState(listing?.description || '')
    const [price, setPrice] = useState(listing?.price || 0);
    const [quantity, setQuantity] = useState(listing?.quantity || 1);

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (productId) dispatch(fetchListing(productId))
    }, [dispatch])

    useEffect(() => {
        const errorObj = {};
        const fileTypes = ['.jpeg', '.png', '.jpg'];

        if (!photo) errorObj['photo'] = 'A photo is required';
        if (!name) errorObj['name'] = 'A name is required';
        if (!description) errorObj['description'] = 'A description is required';
        if (price <= 0 ) errorObj['price'] = 'Please set a price of at least $0.01';
        if (quantity < 1) errorObj['quantity'] = 'Please set a quantity of at least 1';
        if (!(fileTypes.some(type => {
            return photo.endsWith(type)})) && photo.length) {
            errorObj['photo'] = 'Photo URL must end in .png, .jpg, or .jpeg';
        }
        if (submitted) {
        setErrors(errorObj);
        }
    }, [photo, name, description, price, quantity, submitted])


    const cancel = () => {
        history.push('/')
    }

    if (productId) {
        if (!listing) return null;
        if (listing && +productId !== listing.id) return null;
    }

    let title;
    let buttonText;
    if (productId) {
        title = 'Update your listing';
        buttonText = 'Update'
    }
    else {
        title = 'Create a listing'
        buttonText = 'Post'
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitted(true);

        const product = {
            name, description, price, quantity
        }
        if (!Object.keys(errors).length){
            if (productId) {
                product.id = productId;
                await dispatch(updatedListing(product))
                const newImage = { url: photo, productId }
                await dispatch(postImage(newImage))
                history.push(`/listings/${productId}`)
            } else {
            const newListing = await dispatch(createListing(product))

            if (newListing.id) {
                // let newImage;
                // if (!photo.length) newImage = { url: noCow, productId: newListing.id}
                const newImage = { url: photo, productId: newListing.id }
                await dispatch(postImage(newImage))
                history.push(`/listings/${newListing.id}`)

            }}
        } else return
    }

    return (
        <div className='flex-div'>
    <form onSubmit={handleSubmit} className="list-form-box">
            {/* {Object.values(errors).length > 0 && <label className="errors">{errors.comment}</label>} */}
            <h1>{title}</h1>

            <div className='div-border'>
                <p className='p-margin'>Listing details</p>
                <div>
                    
                    <label>Photo</label>
                    <input type='url' className=''
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    />
                    
                </div>
                 {errors.photo && <p className='errors'>{errors.photo}</p>}

                <div>
                    
                    <label>Name</label>
                    <input type='text' className='' 
                    value={name}
                    
                    onChange={(e) => setName(e.target.value)}
                    />
                    
                </div>
                {errors.name && <p className='errors'>{errors.name}</p>}


                {/* <label>Category</label> */}

                <div>
                    
                    <label>Description</label>
                    <textarea 
                    className='' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="8" cols="75"
                    maxlength="1000"
                    />
                </div>
                {errors.description && <p className='errors'>{errors.description}</p>}
                
            </div>

            <div className='div-border'>
                <p className='p-margin'>Inventory and pricing</p>
                <div>
                    
                    <label>Price</label>
                    <span>$</span>
                    <input
                        className=''
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors.price && <p className='errors'>{errors.price}</p>}


                <div>
    
                    <label>Quantity</label>
                    <input
                        className=''
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    
                </div>
                {errors.quantity && <p className='errors'>{errors.quantity}</p>}

            </div>

            <div className='cancel-post-div'>
            <button className='button-white' onClick={cancel}>Cancel</button>
            <button className='button-black' type="submit">{buttonText}</button>
            </div>
        </form>
        </div>
    )
}

export default ListingForm;