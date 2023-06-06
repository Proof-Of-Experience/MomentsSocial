const notificationList = [
    {
        id: 1,
        title: 'Lorem Ipsum'
    },
    {
        id: 2,
        title: 'Lorem Ipsum'
    },
]


const Notifications = ({ imageData }: any) => {

    return (
        <div className="bg-white shadow px-5 py-4 w-[300px]">
            <h3 className="font-bold">Notifications</h3>

            {
                notificationList.map((notification: any) => 
                    <div>{notification.title}</div>
                )
            }
        </div>
    )
}

export default Notifications
