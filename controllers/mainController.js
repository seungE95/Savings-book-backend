export const monthTotal = (req,res) => {
    const {username} = req.decoded;
    const {year, month} = req.body;

    

    res.send("monthTotal");
}

export const getGoal = (req,res) => {
    res.send("getGoal");
}

export const postGoal = (req,res) => {
    res.send("postGoal");
}

export const putGoal = (req,res) => {
    res.send("putGoal");
}

export const category = (req,res) => {
    res.send("category");
}

export const dailylist = (req,res) => {
    res.send("dailylist");
}

export const calendar = (req,res) => {
    res.send("calendar");
}

export const getDetails = (req,res) => {
    res.send("getDetails");
}

export const postDetails = (req,res) => {
    res.send("postDetails");
}

export const putDetails = (req,res) => {
    res.send("putDetails");
}

export const badge = (req,res) => {
    res.send("badge");
}