import TopNav from "./Components/TopNav";
import ArticleRow from "./Components/ArticleRow"
import FeatureSlider from "./Components/FeatureSlider"


function App() {
  return (
   <div>
     <TopNav />
      <FeatureSlider />
      <h2 className='rowName'>Newest Articles</h2>
      <ArticleRow />
      <h2 className='rowName'>Most Popular</h2>
      <ArticleRow />
      <h2 className='rowName'>Top Articles Published by You</h2>
      <ArticleRow />
   </div>
  );
}

export default App;
