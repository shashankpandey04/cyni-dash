export default function Unauthorized() {
  return (
    <div className="p-20 text-center">
      <h1 className="text-4xl font-bold text-red-500">
        Unauthorized
      </h1>
      <p className="mt-4 text-gray-400">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
