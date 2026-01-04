export default function About() {
    return (
        <>
            <div className="bg-[url('/About_Background.png')] bg-[length:688.5px_175px] bg-repeat w-full h-[180px] mb-5"></div>

            <div className="flex justify-center items-center gap-3 flex-col w-7/12 mx-auto">
                <h1 className="text-4xl font-bungee">About Us</h1>
                <p className="text-justify text-lg font-montserrat">
                    The Money Jug is a simple yet effective way to save money and track your progress. The idea is 
                    to deposit spare change or cash into a designated jug, watching your savings grow over time. Our 
                    project aims to promote financial discipline, patience, and responsibility, helping individuals 
                    achieve their savings goals and develop healthy financial habits.
                </p>
                <h1 className="text-4xl font-bungee">How it works:</h1>
                <p className="text-justify text-lg font-montserrat">
                    1. Choose a jug or container. <br />
                    2. Decide how much you want to save. <br />
                    3. Put in spare change or cash regularly. <br />
                    4. Watch your jug slowly fill up until it’s full. <br />
                </p>
            </div>
        </>
    );
}