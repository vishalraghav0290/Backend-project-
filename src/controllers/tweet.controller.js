import { tweet, tweet } from "../models/tweet.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";


// thing to do :

// make a tweet 
const makeTweet = asyncHandler(async(req , res)=>{
    const userId = req.user._id
    const {content} = req.body
    

    const user = await User.findById(userId)

    // check is present 
    if(!user){
        throw new ApiError(400 , "user not fount error : controller/tweet line no 20")
    }
    if(!content || content.trim()===0){
        throw new ApiError(400 , " content is not provided by u error : controllers/tweet line 23")
    }

    // now creating a tweet instance if user and content succesfully prtesent 
    const newTweet = await tweet.create(
        {
            owner: userId,
            content: content
        }
    )
   return res.status(200).json(new ApiResponse(200, newTweet , "succesfully maded a tweeet"))

    
})

// edit a tweet
const updateTweet = asyncHandler(async(req, res)=>{
    // to edit a tweet we need a userId and tweet id 
    // we need both to verify that same user is updating tweeet or someone else as owner can only manipulte tweet 
    const userId = req.user._id
    const {tweetId} = req.query
    const {upTweet} = req.body 

    const user = await User.findById(userId)
    const tweet= await tweet.findById(tweetId)


    //check if present 
    if(!tweet){
        throw new ApiError(400 , "tweer not found controller/tweet line 52")
    }
    if(!user){
        throw new ApiError(400 , "tweer not found controller/tweet line 55")
    }
    // Verify if the logged-in user is the owner of the tweet
    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only edit your own tweets");
    }

    const updatedTweet = tweet.findByIdAndUpdate(userId , {$push:{tweet: upTweet}} , {new : true})

    return res.status(200).json(new ApiResponse(200 , updatedTweet , "tweet updated succesfully  "))
})
// remove a tweet 
const deletetweet = asyncHandler(async(req , res)=>{
    // to delete a tweet we need first tweet id and user id 
    // we need user id coz ownere can only remove it tweet 

    const userId = req.user._id
    const {tweetId} = req.query

    const user = await User.findById(userId)
    const tweetDoc = await tweet.findById(tweetId)

    // check user and tweet id present 

    if(!user){
        throw new ApiError(400 , "user not found error from controller/tweet line 80")
    }
    if(!tweetDoc){
        throw new ApiError(400 , "tweet not found error from controller/tweet line 83")
    }

    // verification that owner is trying to delete or not

    if(!(tweetDoc.owner.toString()===userId.toString())){
        throw new ApiError(400 , "only tweetowner has permisson to remove its tweeet")
    }

    await tweetDoc.deleteOne();

    return res.status(200).json(new ApiResponse(200 , null , "tweet deeleted succesfully "))

})

// to show all tweet which content of tweeet comtent and owner of that tweet 
const showAlltweet = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, userId } = req.query; // Accept `userId` for fetching specific user's tweets

    let query = {}; // Default: fetch all tweets

    if (userId) {
        // If userId is provided, fetch tweets from that user only
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(400, "User not found error from controller/tweet line no 115");
        }
        query.owner = userId;
    }

    const allTweets = await tweet
        .find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("owner", "username email"); 

    return res.status(200).json(new ApiResponse(200, allTweets, "Fetched tweets successfully"));
});

export {makeTweet , updateTweet ,deletetweet , showAlltweet}







