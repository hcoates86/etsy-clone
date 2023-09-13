import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './ListingForm.css'
import { createListing, postImage } from '../../store/listings';
import noCow from '../../images/noCow.png';


const UpdateListing = ({productId}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [photo, setPhoto] = useState('')
    const [name, setName] = useState('')
    // const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const errorObj = {};
        const fileTypes = ['.jpeg', '.png', '.jpg'];

        // if (!photo) errorObj['photo'] = ''
        if (!name) errorObj['name'] = 'A name is required';
        if (!description) errorObj['description'] = 'A description is required';
        if (!price) errorObj['price'] = 'Please set a price of at least $0.01';
        if (!quantity) errorObj['quantity'] = 'Please set a quantity of at least 1';
        if (!(fileTypes.some(type => {
            return photo.endsWith(type)})) && photo.length) {
            errorObj['photo'] = 'Photo URL must end in .png, .jpg, or .jpeg';
        }
        setErrors(errorObj);
        
    }, [photo, name, description, price, quantity])


    const cancel = () => {
        history.push('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const listing = {
            name, description, price, quantity
        }

        const newListing = dispatch(createListing(listing))

        if (newListing.id) {
            const newImage = { url: photo, productId: newListing.id}
            dispatch(postImage(newImage));

            history.push(`/listings/${newListing.id}`)

        }

    }

    return (
    <form onSubmit={handleSubmit} className="list-form-box">
            {/* {Object.values(errors).length > 0 && <label className="errors">{errors.comment}</label>} */}
            <h1>Create a listing</h1>

            <div>
                <p>Listing details</p>
                <div>
                    
                    <label>Photo</label>
                    <input type='url' className=''
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    />
                    
                </div>

                <div>
                    
                    <label>Name</label>
                    <input type='text' className='' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                    
                </div>
                {/* <label>Category</label> */}

                <div>
                    
                    <label>Description</label>
                    <textarea 
                    className='' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="8" cols="75"
                    />
                </div>
                
            </div>

            <div>
                <p>Inventory and pricing</p>
                <div>
                    
                    <label>Price</label>
                    <input
                        className=''
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
    
                    <label>Quantity</label>
                    <input
                        className=''
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
    
                    
                </div>
            </div>

            <div className='cancel-post-div'>
            <button className='button-white' onClick={cancel}>Cancel</button>
            <button className='button-black' type="submit">Post</button>
            </div>
        </form>

    )
}

export default UpdateListing;