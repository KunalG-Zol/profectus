import { motion } from 'framer-motion';
import { card } from '../../lib/styles';

const Card = ({ children, className = '', hover = true, ...props }) => (
  <motion.div className={card({ hover, className })} {...props}>
    {children}
  </motion.div>
);

export default Card;
