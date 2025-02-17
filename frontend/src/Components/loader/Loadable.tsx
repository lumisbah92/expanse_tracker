import { ElementType, Suspense } from 'react';
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //
const Loadable = (Component: ElementType) => {
  const LoadableComponent = (props: any) => {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };

  return LoadableComponent;
};

export default Loadable;
