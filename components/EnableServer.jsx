

export default async function EnableServer() {
  const data =await fetch("https://flowery-hexagonal-thrill.glitch.me",{cache :"no-store"}) 

  console.log(data);
    return null;
}
