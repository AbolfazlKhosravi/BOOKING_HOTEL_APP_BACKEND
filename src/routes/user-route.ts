import  express  from 'express';
import { login, register ,getUser,logout} from '../controllers/user-controller';
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user",getUser)



export default router;