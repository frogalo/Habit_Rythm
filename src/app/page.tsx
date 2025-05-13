import Link from "next/link";
import LoginButton from "./components/buttons/LoginButton";

export default function HomePage() {
    return (
        <div>
            <h2>Welcome to Habit Rhythm!</h2>
            <LoginButton />
            <Link href="/habits">Go to Habit Tracker</Link>
        </div>
    );
}