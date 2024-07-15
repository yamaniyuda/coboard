import Image from "next/image"

const EmptySearch = () => {
  return(
    <div className="h-full flex flex-col justify-center items-center">
      <Image 
        src="/empty-search.svg"
        height={140}
        width={140}
        alt="Empty Search"
      />
      <h2 className="text-2xl font-semibold mt-6">
        No results found!
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Try searching for something else
      </p>
    </div>
  )
}

export { EmptySearch }