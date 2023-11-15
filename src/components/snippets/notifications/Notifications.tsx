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


const Notifications = ({ notifications }: any) => {

    return (
        <div className="bg-white shadow px-5 py-4 w-[300px]">
            <h3 className="font-semibold">Notifications</h3>

            {
                notificationList.map((notification: any, index: number) => 
                    <div key={index}>{notification.title}</div>
                )
            }
        </div>
    )
}

export default Notifications
