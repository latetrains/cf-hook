const distributionKey = "DistributionId";

exports.handler = async (event) => {
    
    let message = JSON.parse(event.Records[0].Sns.Message);
    let dimensions = message.Trigger.Dimensions;
    
    dimensions.forEach(value => {
        if(value.name == distributionKey){
            console.log(value.value); 
        }
    });
};
